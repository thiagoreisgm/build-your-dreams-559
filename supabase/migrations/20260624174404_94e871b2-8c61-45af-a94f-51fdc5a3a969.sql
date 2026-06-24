-- 1. integrations: add INSERT/UPDATE RLS scoped to owner
CREATE POLICY "own_integration_insert" ON public.integrations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_integration_update" ON public.integrations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. integrations: prevent exposing OAuth tokens via the Data API.
-- Tokens are written/read only by trusted server code (service_role).
REVOKE SELECT (access_token, refresh_token) ON public.integrations FROM authenticated;
REVOKE SELECT (access_token, refresh_token) ON public.integrations FROM anon;

-- 3. Lock down SECURITY DEFINER trigger functions so they cannot be
--    invoked directly via the Data API by anon/authenticated roles.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
