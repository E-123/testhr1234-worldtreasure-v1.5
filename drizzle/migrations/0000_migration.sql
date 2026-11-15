CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.treasures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title_zh text NOT NULL,
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  dynasty_zh text NOT NULL DEFAULT '',
  dynasty_en text NOT NULL DEFAULT '',
  dynasty_fr text NOT NULL DEFAULT '',
  cat_zh text NOT NULL DEFAULT '',
  cat_en text NOT NULL DEFAULT '',
  cat_fr text NOT NULL DEFAULT '',
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.treasures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.treasures TO authenticated;
GRANT ALL ON public.treasures TO service_role;
ALTER TABLE public.treasures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.treasures FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert" ON public.treasures FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update" ON public.treasures FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete" ON public.treasures FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

INSERT INTO public.treasures (image_url,title_zh,title_en,title_fr,dynasty_zh,dynasty_en,dynasty_fr,cat_zh,cat_en,cat_fr,"order") VALUES
('/images/hero-vase.jpg','龙泉青瓷梅瓶','Longquan Celadon Vase','Vase en céladon de Longquan','宋代','Song Dynasty','Dynastie Song','瓷器','Porcelain','Porcelaine',1),
('/images/t1.jpg','青花云龙纹罐','Blue-and-White Dragon Jar','Jarre bleu et blanc au dragon','明代','Ming Dynasty','Dynastie Ming','瓷器','Porcelain','Porcelaine',2),
('/images/t2.jpg','兽面纹青铜方鼎','Bronze Ding with Taotie Motif','Ding en bronze au taotie','商代','Shang Dynasty','Dynastie Shang','青铜器','Bronze','Bronze',3),
('/images/t3.jpg','白玉镂雕龙纹佩','Carved White Jade Dragon Pendant','Pendentif en jade blanc au dragon','清代','Qing Dynasty','Dynastie Qing','玉器','Jade','Jade',4),
('/images/t4.jpg','溪山清远图','Streams and Mountains','Ruisseaux et montagnes','宋代','Song Dynasty','Dynastie Song','书画','Painting','Peinture',5);

CREATE POLICY "treasure images read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'treasures');
CREATE POLICY "admin upload treasure images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'treasures' AND public.has_role(auth.uid(),'admin'));