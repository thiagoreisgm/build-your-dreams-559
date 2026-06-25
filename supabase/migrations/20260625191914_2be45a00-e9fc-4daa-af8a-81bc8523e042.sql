REVOKE INSERT (access_token, refresh_token) ON public.integrations FROM authenticated;
REVOKE UPDATE (access_token, refresh_token) ON public.integrations FROM authenticated;