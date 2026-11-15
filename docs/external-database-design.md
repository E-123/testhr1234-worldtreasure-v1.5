# External database design — not applied

The requested external database is not connected to this Cloud-backed app. This document is a schema specification, not a migration. No changes have been applied to either database. The current website, account records, images and existing treasures remain in place.

## Administrator accounts

- Use the authentication service's managed user accounts for email, password hashes, sessions and password recovery. Never create an application table containing plaintext passwords or copy a service-account password into website login.
- `public.user_roles`: `id uuid primary key default gen_random_uuid()`, `user_id uuid not null`, `role app_role not null`; unique `(user_id, role)`. Enum values: `admin`, `user`. This is already the app's permission model.
- Only users may read their own role records. Ordinary authenticated users must not insert, update or delete roles. Privileged provisioning assigns administrators explicitly; registration must not automatically make someone an administrator.
- `has_role(user_id, role)` is a stable security-definer function with a fixed `public` search path; protected content writes use it in row-level security policies.
- No profile table is necessary for current login: no extra user-facing profile fields have been requested.

## Association content

`public.association_content`

| Column | Type / default | Purpose |
| --- | --- | --- |
| id | uuid primary key, generated | Stable record identifier |
| section_key | text not null, unique | introduction, mission, values, history, organisation, credentials |
| content_zh | jsonb not null, default `{}` | Exact Chinese content and repeated items |
| content_en | jsonb not null, default `{}` | Exact English content and repeated items |
| content_fr | jsonb not null, default `{}` | Exact French content and repeated items |
| image_url | text not null, default empty string | Existing image location, where present |
| display_order | integer not null, default 0 | Original section order |
| created_at | timestamptz not null, default now() | Creation time |
| updated_at | timestamptz not null, default now() | Last edit time, updated by trigger |

Preserve all displayed section titles, supporting text, three values, all four historical entries, three organisation cards and three credentials cards in each language. Store displayed kicker text and icon keys with their sections; keep the existing presentation and images unchanged. Shared introduction and mission values must match those used on the homepage.

## News content

`public.news_items`

| Column | Type / default | Purpose |
| --- | --- | --- |
| id | uuid primary key, generated | Stable identifier |
| legacy_id | integer unique | Preserve existing news identity |
| image_url | text not null | Current news image |
| publication_date | date not null | Existing displayed date |
| title_zh, title_en, title_fr | text not null, default empty string | Existing translated title |
| cat_zh, cat_en, cat_fr | text not null, default empty string | Existing translated category |
| excerpt_zh, excerpt_en, excerpt_fr | text not null, default empty string | Existing translated excerpt |
| body_zh, body_en, body_fr | text not null, default empty string | Optional full article, without inventing new content |
| display_order | integer not null, default 0 | Original ordering |
| homepage_featured | boolean not null, default false | Original homepage selection |
| created_at, updated_at | timestamptz not null, default now() | Audit timestamps |

Keep all three original news records and the three repeated entries currently displayed on the news page (legacy IDs 1, 2, 3, 101, 102, 103). Do not deduplicate visible entries without approval. Homepage selection includes only original IDs 1, 2, 3.

## Treasures

Retain the existing `public.treasures` schema: `id`, `image_url`, `title_zh/en/fr`, `dynasty_zh/en/fr`, `cat_zh/en/fr`, `order`, `created_at`, with the same types, defaults and identifiers. Copy every live row, not only the five homepage examples. Preserve homepage examples separately until their identity/order is explicitly mapped; do not replace them with a different query result.

The `treasures` bucket is private. Copy original image bytes and paths, recreate authorized upload policies, and use readable signed image URLs where required. Do not move only database URLs while leaving the actual files behind.

## Access and implementation requirements

For each public content table, a real migration must execute in this order: CREATE TABLE, explicit GRANT, ENABLE ROW LEVEL SECURITY, CREATE POLICY. Grant public SELECT to `anon` and `authenticated`; grant content INSERT/UPDATE/DELETE to `authenticated`, with admin-only policies enforced by `has_role`; grant ALL to `service_role`. For `user_roles`, grant own-role SELECT to authenticated only and privileged management to service_role. No anonymous role access.

All new content is public; no draft/hidden state is introduced. If later introduced, it requires separate authorized owner/admin read policies and fetch paths.

## Preservation and cutover checklist

1. Obtain a supported authorized connection to the requested external project; never use the current project's migration tools to silently modify the wrong database.
2. Export and back up existing live rows, user accounts and storage; inventory destination tables before applying additive changes.
3. Apply schema via an authorized migration workflow, then copy exact existing content and assets. Preserve all languages, IDs, dates, categories and ordering. Do not overwrite unrelated destination data.
4. Recreate and verify access policies, sign-in settings and explicit administrator role assignment. Passwords supplied for the service account are not website users.
5. Connect the application only after row counts, field comparisons and image checks pass. Retain the current source during cutover.
6. Verify all public pages and an actual administrator sign-in/create/edit/read/delete flow. Do not report external migration or login as complete until verified against that project.