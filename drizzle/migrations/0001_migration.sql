UPDATE auth.users SET email_confirmed_at = now() WHERE id = '7aa6a562-a1c9-4540-9292-301c871cf185' AND email_confirmed_at IS NULL;
INSERT INTO public.user_roles (user_id, role) SELECT '7aa6a562-a1c9-4540-9292-301c871cf185','admin' WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = '7aa6a562-a1c9-4540-9292-301c871cf185') ON CONFLICT DO NOTHING;
