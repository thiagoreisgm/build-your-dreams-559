ALTER TABLE public.inspirations
  ADD COLUMN likes_count int GENERATED ALWAYS AS (NULLIF(metrics->>'likes','')::int) STORED,
  ADD COLUMN comments_count int GENERATED ALWAYS AS (NULLIF(metrics->>'comments','')::int) STORED,
  ADD COLUMN followers_count int GENERATED ALWAYS AS (NULLIF(metrics->>'followers','')::int) STORED;

CREATE INDEX inspirations_likes_idx ON public.inspirations (likes_count);
CREATE INDEX inspirations_comments_idx ON public.inspirations (comments_count);
CREATE INDEX inspirations_followers_idx ON public.inspirations (followers_count);

REVOKE UPDATE ON public.saved_items FROM authenticated;