-- Replace table-level SELECT with column-level SELECT excluding token columns.
REVOKE SELECT ON public.integrations FROM authenticated;
REVOKE SELECT ON public.integrations FROM anon;

GRANT SELECT (
  id,
  user_id,
  provider,
  provider_account_id,
  scope,
  expires_at,
  metadata,
  created_at,
  updated_at
) ON public.integrations TO authenticated;
