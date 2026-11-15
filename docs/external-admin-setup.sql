-- Run once in YOUR Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Custom admin accounts: username / email + password (bcrypt hash via pgcrypto). No Supabase Auth users needed.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username ~ '^[A-Za-z0-9_.-]{3,32}$'),
  display_name text not null default '',
  email text not null unique,
  password_hash text not null,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_sessions (
  token uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_users(id) on delete cascade,
  expires_at timestamptz not null default now() + interval '7 days'
);
-- No direct table access from the browser; everything goes through the functions below.
grant all on public.admin_users, public.admin_sessions to service_role;
alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;

-- Returns the admin id for a valid session token (null otherwise).
create or replace function public.admin_from_token(p_token uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select s.admin_id from admin_sessions s join admin_users u on u.id = s.admin_id
  where s.token = p_token and s.expires_at > now() and u.is_active limit 1 $$;

-- Login: username or email + password. Returns token + profile, or nothing when wrong.
create or replace function public.admin_login(p_identifier text, p_password text)
returns table (token uuid, id uuid, username text, display_name text, email text, last_login_at timestamptz)
language plpgsql security definer set search_path = public, extensions as $$
declare u admin_users; t uuid;
begin
  select * into u from admin_users a
   where (lower(a.username) = lower(trim(p_identifier)) or lower(a.email) = lower(trim(p_identifier))) and a.is_active limit 1;
  if u.id is null or u.password_hash <> crypt(p_password, u.password_hash) then return; end if;
  delete from admin_sessions where expires_at < now();
  insert into admin_sessions(admin_id) values (u.id) returning admin_sessions.token into t;
  update admin_users set last_login_at = now() where admin_users.id = u.id;
  return query select t, u.id, u.username, u.display_name, u.email, now();
end $$;

create or replace function public.admin_me(p_token uuid)
returns table (id uuid, username text, display_name text, email text, last_login_at timestamptz)
language sql stable security definer set search_path = public as $$
  select u.id, u.username, u.display_name, u.email, u.last_login_at from admin_users u where u.id = admin_from_token(p_token) $$;

create or replace function public.admin_logout(p_token uuid) returns void
language sql security definer set search_path = public as $$ delete from admin_sessions where token = p_token $$;

create or replace function public.admin_update_profile(p_token uuid, p_username text, p_display_name text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if admin_from_token(p_token) is null then raise exception 'not authorized'; end if;
  update admin_users set username = trim(p_username), display_name = trim(p_display_name), updated_at = now() where id = admin_from_token(p_token);
end $$;

create or replace function public.admin_change_password(p_token uuid, p_current text, p_new text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare aid uuid := admin_from_token(p_token);
begin
  if aid is null or length(p_new) < 8 then return false; end if;
  update admin_users set password_hash = crypt(p_new, gen_salt('bf')), updated_at = now()
   where id = aid and password_hash = crypt(p_current, password_hash);
  return found;
end $$;

-- Treasures: everyone can read; only admins (via token) can write.
create table if not exists public.treasures (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  title_zh text not null default '', title_en text default '', title_fr text default '',
  dynasty_zh text default '', dynasty_en text default '', dynasty_fr text default '',
  cat_zh text default '', cat_en text default '', cat_fr text default '',
  description_zh text not null default '', description_en text not null default '', description_fr text not null default '',
  tags_zh text[] not null default '{}'::text[], tags_en text[] not null default '{}'::text[], tags_fr text[] not null default '{}'::text[],
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
-- Safe to run again: existing treasures keep every current value.
alter table public.treasures add column if not exists description_zh text not null default '';
alter table public.treasures add column if not exists description_en text not null default '';
alter table public.treasures add column if not exists description_fr text not null default '';
alter table public.treasures add column if not exists tags_zh text[] not null default '{}'::text[];
alter table public.treasures add column if not exists tags_en text[] not null default '{}'::text[];
alter table public.treasures add column if not exists tags_fr text[] not null default '{}'::text[];
grant select on public.treasures to anon, authenticated;
grant all on public.treasures to service_role;
alter table public.treasures enable row level security;
drop policy if exists "public read treasures" on public.treasures;
create policy "public read treasures" on public.treasures for select to anon, authenticated using (true);

create or replace function public.admin_save_treasure(p_token uuid, p_id uuid, p jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if admin_from_token(p_token) is null then raise exception 'not authorized'; end if;
  if p_id is null then
    insert into treasures(image_url,title_zh,title_en,title_fr,dynasty_zh,dynasty_en,dynasty_fr,cat_zh,cat_en,cat_fr,
      description_zh,description_en,description_fr,tags_zh,tags_en,tags_fr,"order")
    values (p->>'image_url',p->>'title_zh',p->>'title_en',p->>'title_fr',p->>'dynasty_zh',p->>'dynasty_en',p->>'dynasty_fr',p->>'cat_zh',p->>'cat_en',p->>'cat_fr',
      coalesce(p->>'description_zh',''),coalesce(p->>'description_en',''),coalesce(p->>'description_fr',''),
      coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(p->'tags_zh','[]'::jsonb))), '{}'::text[]),
      coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(p->'tags_en','[]'::jsonb))), '{}'::text[]),
      coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(p->'tags_fr','[]'::jsonb))), '{}'::text[]),
      coalesce((p->>'order')::int,0));
  else
    update treasures set image_url=p->>'image_url',title_zh=p->>'title_zh',title_en=p->>'title_en',title_fr=p->>'title_fr',
      dynasty_zh=p->>'dynasty_zh',dynasty_en=p->>'dynasty_en',dynasty_fr=p->>'dynasty_fr',cat_zh=p->>'cat_zh',cat_en=p->>'cat_en',cat_fr=p->>'cat_fr',
      description_zh=coalesce(p->>'description_zh',description_zh),description_en=coalesce(p->>'description_en',description_en),description_fr=coalesce(p->>'description_fr',description_fr),
      tags_zh=case when p ? 'tags_zh' then coalesce((select array_agg(value) from jsonb_array_elements_text(p->'tags_zh')), '{}'::text[]) else tags_zh end,
      tags_en=case when p ? 'tags_en' then coalesce((select array_agg(value) from jsonb_array_elements_text(p->'tags_en')), '{}'::text[]) else tags_en end,
      tags_fr=case when p ? 'tags_fr' then coalesce((select array_agg(value) from jsonb_array_elements_text(p->'tags_fr')), '{}'::text[]) else tags_fr end,
      "order"=coalesce((p->>'order')::int,0) where id = p_id;
  end if;
end $$;

create or replace function public.admin_delete_treasure(p_token uuid, p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if admin_from_token(p_token) is null then raise exception 'not authorized'; end if;
  delete from treasures where id = p_id;
end $$;

revoke all on function public.admin_from_token(uuid), public.admin_login(text,text), public.admin_me(uuid), public.admin_logout(uuid),
  public.admin_update_profile(uuid,text,text), public.admin_change_password(uuid,text,text),
  public.admin_save_treasure(uuid,uuid,jsonb), public.admin_delete_treasure(uuid,uuid) from public;
grant execute on function public.admin_from_token(uuid), public.admin_login(text,text), public.admin_me(uuid), public.admin_logout(uuid),
  public.admin_update_profile(uuid,text,text), public.admin_change_password(uuid,text,text),
  public.admin_save_treasure(uuid,uuid,jsonb), public.admin_delete_treasure(uuid,uuid) to anon, authenticated;

-- ===== Image storage: public bucket "treasures"; real image links go into image_url =====
insert into storage.buckets (id, name, public) values ('treasures', 'treasures', true) on conflict (id) do update set public = true;
drop policy if exists "admin upload treasures" on storage.objects;
create policy "admin upload treasures" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'treasures' and public.admin_from_token(nullif(current_setting('request.headers', true)::json->>'x-admin-token','')::uuid) is not null);

-- ===== Initial admin: username admin / password admin123 (change the password after first sign-in) =====
insert into public.admin_users (username, display_name, email, password_hash)
values ('admin', '管理员', 'admin@example.com', extensions.crypt('admin123', extensions.gen_salt('bf')))
on conflict (username) do nothing;

-- ===== Move the current site images into storage =====
-- 1) Storage -> treasures bucket -> upload hero-vase.jpg, t1.jpg, t2.jpg, t3.jpg, t4.jpg (from public/images).
-- 2) Run (replaces nothing that already exists with the same title):
-- insert into public.treasures (image_url, title_zh, title_en, title_fr, dynasty_zh, dynasty_en, dynasty_fr, "order")
-- select 'https://iwasmcrdvuydctrigoll.supabase.co/storage/v1/object/public/treasures/' || f, z, e, fr, dz, de, df, o from (values
--  ('hero-vase.jpg','龙泉青瓷梅瓶','Longquan Celadon Vase','Vase en céladon','宋代','Song Dynasty','Dynastie Song',1),
--  ('t1.jpg','青花云龙纹罐','Blue-and-White Dragon Jar','Jarre bleu et blanc','明代','Ming Dynasty','Dynastie Ming',2),
--  ('t2.jpg','兽面纹青铜方鼎','Bronze Ding','Ding en bronze','商代','Shang Dynasty','Dynastie Shang',3),
--  ('t3.jpg','白玉镂雕龙纹佩','White Jade Dragon Pendant','Pendentif en jade','清代','Qing Dynasty','Dynastie Qing',4),
--  ('t4.jpg','溪山清远图','Streams and Mountains','Ruisseaux et montagnes','宋代','Song Dynasty','Dynastie Song',5)
-- ) v(f,z,e,fr,dz,de,df,o) where not exists (select 1 from public.treasures t where t.title_zh = v.z);

-- ===== Association, news and contact management (additive; existing rows are preserved) =====
create table if not exists public.association_content (
 id uuid primary key default gen_random_uuid(), section_key text not null unique,
 content_zh jsonb not null default '{}', content_en jsonb not null default '{}', content_fr jsonb not null default '{}',
 image_url text not null default '', display_order int not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.association_content to anon, authenticated;
grant all on public.association_content to service_role;
alter table public.association_content enable row level security;
drop policy if exists "public read association" on public.association_content;
create policy "public read association" on public.association_content for select to anon, authenticated using (true);

create table if not exists public.contact_content (
 id uuid primary key default gen_random_uuid(), section_key text not null unique,
 content_zh jsonb not null default '{}', content_en jsonb not null default '{}', content_fr jsonb not null default '{}',
 image_url text not null default '', display_order int not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.contact_content to anon, authenticated;
grant all on public.contact_content to service_role;
alter table public.contact_content enable row level security;
drop policy if exists "public read contact" on public.contact_content;
create policy "public read contact" on public.contact_content for select to anon, authenticated using (true);

create table if not exists public.news_items (
 id uuid primary key default gen_random_uuid(), legacy_id int unique,
 image_url text not null default '', publication_date date not null default current_date,
 title_zh text not null default '', title_en text not null default '', title_fr text not null default '',
 cat_zh text not null default '', cat_en text not null default '', cat_fr text not null default '',
 excerpt_zh text not null default '', excerpt_en text not null default '', excerpt_fr text not null default '',
 body_zh text not null default '', body_en text not null default '', body_fr text not null default '',
 display_order int not null default 0, homepage_featured boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.news_items to anon, authenticated;
grant all on public.news_items to service_role;
alter table public.news_items enable row level security;
drop policy if exists "public read news" on public.news_items;
create policy "public read news" on public.news_items for select to anon, authenticated using (true);

create or replace function public.admin_save_content(p_token uuid, p_table text, p_id uuid, p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare target_id uuid; columns_sql text; assignment_sql text; base jsonb;
begin
 if admin_from_token(p_token) is null then raise exception 'not authorized' using errcode = '42501'; end if;
 if p_table not in ('association_content','news_items','contact_content') then raise exception 'invalid content table'; end if;
 if jsonb_typeof(p) <> 'object' then raise exception 'invalid content'; end if;
 if p_table = 'news_items' then
  columns_sql := 'image_url,publication_date,title_zh,title_en,title_fr,cat_zh,cat_en,cat_fr,excerpt_zh,excerpt_en,excerpt_fr,body_zh,body_en,body_fr,display_order,homepage_featured';
  base := jsonb_build_object('image_url','','publication_date',current_date,'title_zh','','title_en','','title_fr','','cat_zh','','cat_en','','cat_fr','','excerpt_zh','','excerpt_en','','excerpt_fr','','body_zh','','body_en','','body_fr','','display_order',0,'homepage_featured',false);
 else
  columns_sql := 'section_key,content_zh,content_en,content_fr,image_url,display_order';
  base := jsonb_build_object('section_key','','content_zh','{}'::jsonb,'content_en','{}'::jsonb,'content_fr','{}'::jsonb,'image_url','','display_order',0);
  if coalesce(p->>'section_key','') not in ('introduction','mission','values','history','organisation','credentials','contact') then raise exception 'invalid section'; end if;
  if (p_table = 'contact_content') <> (p->>'section_key' = 'contact') then raise exception 'invalid section table'; end if;
 end if;
 if p_id is null then
  if p_table <> 'news_items' then
   execute format('select id from public.%I where section_key = $1',p_table) into target_id using p->>'section_key';
  end if;
 else
  execute format('select id from public.%I where id = $1',p_table) into target_id using p_id;
  if target_id is null then raise exception 'content not found'; end if;
 end if;
 if target_id is null then
  execute format('insert into public.%I (%s) select %s from jsonb_populate_record(null::public.%I,$1) returning id',p_table,columns_sql,columns_sql,p_table) into target_id using base || p;
 else
  execute format('select to_jsonb(t) from public.%I t where id = $1',p_table) into base using target_id;
  select string_agg(format('%I = r.%I',c,c),',') into assignment_sql from unnest(string_to_array(columns_sql,',')) c;
  execute format('update public.%I t set %s, updated_at = now() from jsonb_populate_record(null::public.%I,$1) r where t.id = $2',p_table,assignment_sql,p_table) using base || p, target_id;
 end if;
 return target_id;
end $$;

create or replace function public.admin_delete_news(p_token uuid, p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
 if admin_from_token(p_token) is null then raise exception 'not authorized' using errcode = '42501'; end if;
 delete from news_items where id = p_id;
end $$;
revoke all on function public.admin_save_content(uuid,text,uuid,jsonb), public.admin_delete_news(uuid,uuid) from public;
grant execute on function public.admin_save_content(uuid,text,uuid,jsonb), public.admin_delete_news(uuid,uuid) to anon, authenticated;

-- Exact existing page content, inserted only where no corresponding record exists.
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'introduction','',0,'{"title": "世界瑰宝艺术协会", "body": "1993年创立于法国巴黎，依据法国1901年结社法注册的国际非营利艺术组织，致力于守护、研究与传播世界艺术瑰宝。"}'::jsonb,'{"title": "World Treasure Art Association", "body": "Founded in Paris in 1993, an international non-profit registered under the French Law of 1901, dedicated to safeguarding, studying and sharing the world''s art treasures."}'::jsonb,'{"title": "Association d''Art du Trésor Mondial", "body": "Fondée à Paris en 1993, association internationale à but non lucratif (loi 1901) dédiée à la sauvegarde, l''étude et la diffusion des trésors artistiques du monde."}'::jsonb where not exists (select 1 from public.association_content where section_key = 'introduction') on conflict do nothing;
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'mission','/images/gallery-space.jpg',1,'{"kicker": "使命", "title": "传承文明，鉴赏真美", "body": "世界瑰宝艺术协会以“管理独立、公共受益、非营利、公开透明”为原则，推动艺术品鉴定标准化、学术交流国际化与文化遗产的永续保护。"}'::jsonb,'{"kicker": "Our Mission", "title": "Preserve Heritage, Celebrate Beauty", "body": "Guided by independence, public benefit, non-profit status and transparency, we advance authentication standards, international scholarship and the lasting protection of cultural heritage."}'::jsonb,'{"kicker": "Notre mission", "title": "Préserver le patrimoine, célébrer la beauté", "body": "Guidés par l''indépendance, l''intérêt public et la transparence, nous promouvons des normes d''expertise, les échanges scientifiques et la protection durable du patrimoine."}'::jsonb where not exists (select 1 from public.association_content where section_key = 'mission') on conflict do nothing;
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'values','',2,'{"items": ["守护", "交流", "传承"]}'::jsonb,'{"items": ["Safeguard", "Exchange", "Legacy"]}'::jsonb,'{"items": ["Protéger", "Échanger", "Transmettre"]}'::jsonb where not exists (select 1 from public.association_content where section_key = 'values') on conflict do nothing;
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'history','',3,'{"kicker": "Since 1993", "title": "发展历程", "items": [{"year": "1993", "text": "巴黎国际凤凰艺术协会成立"}, {"year": "2003", "text": "正式更名为世界瑰宝艺术协会"}, {"year": "2014", "text": "贺玉琴女士当选协会主席"}, {"year": "2026", "text": "章程修订，新增跨界融合方向"}]}'::jsonb,'{"kicker": "Since 1993", "title": "Our History", "items": [{"year": "1993", "text": "International Phoenix Art Association founded in Paris"}, {"year": "2003", "text": "Renamed the World Treasure Art Association"}, {"year": "2014", "text": "Ms. He Yuqin elected Chairwoman"}, {"year": "2026", "text": "Constitution revised — cross-disciplinary mandate added"}]}'::jsonb,'{"kicker": "Since 1993", "title": "Notre histoire", "items": [{"year": "1993", "text": "Fondation de l''Association à Paris"}, {"year": "2003", "text": "Renommée Association d''Art du Trésor Mondial"}, {"year": "2014", "text": "Mme He Yuqin élue présidente"}, {"year": "2026", "text": "Révision de la constitution"}]}'::jsonb where not exists (select 1 from public.association_content where section_key = 'history') on conflict do nothing;
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'organisation','',4,'{"kicker": "Governance", "title": "组织架构", "items": [{"icon": "Users", "title": "理事会", "body": "多元背景、独立运作的最高决策机构。"}, {"icon": "ScrollText", "title": "学术委员会", "body": "负责公益性学术审核与标准制定。"}, {"icon": "Building2", "title": "秘书处", "body": "协会日常运营与对外协调中枢。"}]}'::jsonb,'{"kicker": "Governance", "title": "Organisation", "items": [{"icon": "Users", "title": "Council", "body": "The highest decision body — diverse and independent."}, {"icon": "ScrollText", "title": "Academic Committee", "body": "Oversees scholarly review and standards."}, {"icon": "Building2", "title": "Secretariat", "body": "Coordinates daily operations."}]}'::jsonb,'{"kicker": "Governance", "title": "Organisation", "items": [{"icon": "Users", "title": "Conseil", "body": "L''organe décisionnel suprême, divers et indépendant."}, {"icon": "ScrollText", "title": "Comité académique", "body": "Supervise l''examen scientifique et les normes."}, {"icon": "Building2", "title": "Secrétariat", "body": "Coordonne les opérations quotidiennes."}]}'::jsonb where not exists (select 1 from public.association_content where section_key = 'organisation') on conflict do nothing;
insert into public.association_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'credentials','',5,'{"kicker": "Legal Foundation", "title": "资质与治理", "items": [{"icon": "Landmark", "title": "法国1901年结社法", "body": "依据法国法律合法注册的非营利组织。"}, {"icon": "Award", "title": "登记证号 W751-2003", "body": "巴黎警察总署正式登记备案。"}, {"icon": "Scale", "title": "治理原则", "body": "管理独立、公共受益、非营利、公开透明。"}]}'::jsonb,'{"kicker": "Legal Foundation", "title": "Credentials & Governance", "items": [{"icon": "Landmark", "title": "French Law of 1901", "body": "Lawfully registered non-profit under French law."}, {"icon": "Award", "title": "Reg. No. W751-2003", "body": "Officially registered with the Paris Prefecture."}, {"icon": "Scale", "title": "Governance Principles", "body": "Independent, public-benefit, non-profit, transparent."}]}'::jsonb,'{"kicker": "Legal Foundation", "title": "Accréditations", "items": [{"icon": "Landmark", "title": "Loi de 1901", "body": "Association à but non lucratif enregistrée."}, {"icon": "Award", "title": "N° W751-2003", "body": "Enregistrée à la Préfecture de Paris."}, {"icon": "Scale", "title": "Principes", "body": "Indépendance, intérêt public, transparence."}]}'::jsonb where not exists (select 1 from public.association_content where section_key = 'credentials') on conflict do nothing;
insert into public.contact_content (section_key,image_url,display_order,content_zh,content_en,content_fr) select 'contact','',0,'{"title": "联系我们", "subtitle": "巴黎总部与各代表处随时为您服务。", "kicker": "Paris", "headquarters": "巴黎总部", "address": "12 Rue de la Paix, 75002 Paris, France", "phone": "+33 1 42 00 00 00", "email": "contact@wtaa.org", "hours": "周一至周五 09:00 – 18:00 (CET)", "faq_title": "常见问题", "items": [{"q": "如何成为会员？", "a": "请通过本页留言或邮件提交申请，经理事会审议后发放电子会员证。"}, {"q": "协会的法律性质？", "a": "依据法国1901年结社法注册的非营利国际组织，登记证号 W751-2003。"}, {"q": "如何申请艺术品鉴定？", "a": "会员可在瑰宝展示页面提交鉴定咨询，由专家团进行评估。"}], "form_title": "在线留言", "sent_title": "留言已送达", "sent_body": "我们将尽快回复您。"}'::jsonb,'{"title": "Contact Us", "subtitle": "Our Paris headquarters and representatives are at your service.", "kicker": "Paris", "headquarters": "Paris Headquarters", "address": "12 Rue de la Paix, 75002 Paris, France", "phone": "+33 1 42 00 00 00", "email": "contact@wtaa.org", "hours": "Mon–Fri 09:00 – 18:00 (CET)", "faq_title": "FAQ", "items": [{"q": "How do I become a member?", "a": "Submit your application via this page or email; the Council reviews and issues a digital card."}, {"q": "What is the legal status?", "a": "A non-profit registered under the French Law of 1901, Reg. W751-2003."}, {"q": "How to request authentication?", "a": "Members submit requests in the Gallery; the expert panel evaluates."}], "form_title": "Send a Message", "sent_title": "Message Sent", "sent_body": "We will respond shortly."}'::jsonb,'{"title": "Contactez-nous", "subtitle": "Notre siège parisien à votre service.", "kicker": "Paris", "headquarters": "Siège de Paris", "address": "12 Rue de la Paix, 75002 Paris, France", "phone": "+33 1 42 00 00 00", "email": "contact@wtaa.org", "hours": "Lun–Ven 09h00 – 18h00 (CET)", "faq_title": "FAQ", "items": [{"q": "Comment adhérer ?", "a": "Soumettez votre demande via cette page ou par e-mail."}, {"q": "Statut juridique ?", "a": "Association loi 1901, N° W751-2003."}, {"q": "Authentification ?", "a": "Les membres soumettent une demande dans la Galerie."}], "form_title": "Écrivez-nous", "sent_title": "Message envoyé", "sent_body": "Nous vous répondrons bientôt."}'::jsonb where not exists (select 1 from public.contact_content where section_key = 'contact') on conflict do nothing;
insert into public.news_items (legacy_id,image_url,publication_date,display_order,homepage_featured,title_zh,cat_zh,excerpt_zh,title_en,cat_en,excerpt_en,title_fr,cat_fr,excerpt_fr) select 1,'https://id-preview--a101143f-c79c-47ca-9584-5d63fec67f7a.lovable.app/__l5e/assets-v1/b9b52ef9-1045-4290-9ac2-68a49d174236/news-default-1.jpg','2026-10-18',0,true,'“东方雅韵”中国古代艺术特展巴黎开幕','展览预告','精选百余件宋元明清瓷器、书画与玉器，展期至明年春季。','“Oriental Elegance” Opens in Paris','Exhibition','Over a hundred Song to Qing porcelains, paintings and jades on view until spring.','« Élégance orientale » ouvre à Paris','Exposition','Plus de cent porcelaines, peintures et jades des Song aux Qing.' where not exists (select 1 from public.news_items where legacy_id = '1') on conflict do nothing;
insert into public.news_items (legacy_id,image_url,publication_date,display_order,homepage_featured,title_zh,cat_zh,excerpt_zh,title_en,cat_en,excerpt_en,title_fr,cat_fr,excerpt_fr) select 2,'https://id-preview--a101143f-c79c-47ca-9584-5d63fec67f7a.lovable.app/__l5e/assets-v1/842d4dbf-f3ed-410c-a0b4-e61971a58f86/news-default-2.jpg','2026-09-05',1,true,'第十二届国际艺术品鉴定学术论坛圆满举办','学术论坛','来自二十余国的专家学者共同探讨科技鉴定与文物保护的未来。','12th International Authentication Forum Concludes','Forum','Experts from over twenty countries discussed scientific authentication and conservation.','Clôture du 12e forum international d''expertise','Forum','Des experts de vingt pays ont débattu de l''expertise scientifique.' where not exists (select 1 from public.news_items where legacy_id = '2') on conflict do nothing;
insert into public.news_items (legacy_id,image_url,publication_date,display_order,homepage_featured,title_zh,cat_zh,excerpt_zh,title_en,cat_en,excerpt_en,title_fr,cat_fr,excerpt_fr) select 3,'https://id-preview--a101143f-c79c-47ca-9584-5d63fec67f7a.lovable.app/__l5e/assets-v1/fa994787-8886-45d8-b6f1-ce6cfa9c4ae6/news-default-3.jpg','2026-07-22',2,true,'协会章程修订，新增跨界融合发展方向','协会动态','理事会审议通过新版章程，推动艺术与科技、设计的跨界合作。','Constitution Revised with Cross-Disciplinary Mandate','Association','The Council approved a new constitution promoting art, technology and design collaboration.','Révision de la constitution de l''association','Association','Le Conseil a adopté une nouvelle constitution favorisant les collaborations.' where not exists (select 1 from public.news_items where legacy_id = '3') on conflict do nothing;
notify pgrst, 'reload schema';
