
-- =========================
-- inspirations (shared library)
-- =========================
CREATE TABLE public.inspirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text,
  content text NOT NULL,
  hook text,
  structure_steps text[] NOT NULL DEFAULT '{}',
  format text,
  cta text,
  cta_type text,
  topic text[] NOT NULL DEFAULT '{}',
  language text,
  source_url text,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  search_tsv tsvector GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(content,'') || ' ' || coalesce(hook,''))
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.inspirations TO authenticated;
GRANT ALL ON public.inspirations TO service_role;

ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_inspirations_select_authenticated"
  ON public.inspirations FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX inspirations_search_tsv_idx ON public.inspirations USING gin (search_tsv);
CREATE INDEX inspirations_topic_idx ON public.inspirations USING gin (topic);
CREATE INDEX inspirations_format_idx ON public.inspirations (format);
CREATE INDEX inspirations_language_idx ON public.inspirations (language);

-- =========================
-- templates (shared library)
-- =========================
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  format text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.templates TO authenticated;
GRANT ALL ON public.templates TO service_role;

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_templates_select_authenticated"
  ON public.templates FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX templates_format_idx ON public.templates (format);

-- =========================
-- hooks (shared library)
-- =========================
CREATE TABLE public.hooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hooks TO authenticated;
GRANT ALL ON public.hooks TO service_role;

ALTER TABLE public.hooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_hooks_select_authenticated"
  ON public.hooks FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX hooks_type_idx ON public.hooks (type);

-- =========================
-- saved_items (per-user collection)
-- =========================
CREATE TABLE public.saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('inspiration','template','hook')),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_saved_items_select" ON public.saved_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_saved_items_insert" ON public.saved_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_saved_items_delete" ON public.saved_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX saved_items_user_idx ON public.saved_items (user_id, item_type);

-- =========================
-- SEED
-- =========================
INSERT INTO public.inspirations (author, hook, content, structure_steps, format, cta, cta_type, topic, language, metrics) VALUES
(
  'Jani Vrancsik',
  'We built our first AI agent to better handle our email + LinkedIn motions.',
  'We built our first AI agent to better handle our email + LinkedIn motions. Now you can kill 80% of your repetitive work too, with these:',
  ARRAY['Autoridade','Problema','Lista de soluções','Convite'],
  'lista',
  'Use estes agentes no lugar:',
  'convite',
  ARRAY['IA','prospecção'],
  'en',
  '{"likes":94,"comments":12,"followers":12132}'::jsonb
),
(
  'Camila Ferraz',
  'Demitir meu melhor vendedor foi a decisão que dobrou minha receita.',
  'Demitir meu melhor vendedor foi a decisão que dobrou minha receita. Parece loucura, mas...',
  ARRAY['Confissão','Contexto','Virada','Lição','Pergunta'],
  'historia',
  'E você, já tomou uma decisão dessas?',
  'pergunta',
  ARRAY['liderança','vendas'],
  'pt-BR',
  '{"likes":214,"comments":38,"followers":8940}'::jsonb
),
(
  'Ravi Shrivas',
  'Most B2B companies aren''t behind on AI because they lack tools.',
  'Most B2B companies aren''t behind on AI because they lack tools. They''re behind because they don''t have a system.',
  ARRAY['Crença comum','Reframe','Argumento','Prova'],
  'contrarian',
  NULL,
  'convite',
  ARRAY['IA','sistema'],
  'en',
  '{"likes":175,"comments":52,"followers":1411}'::jsonb
);

INSERT INTO public.templates (title, body, format) VALUES
(
  'Insight em lista',
  '[Gancho]

Aqui estão N coisas que aprendi:

1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

[CTA]',
  'lista'
);

INSERT INTO public.hooks (type, text) VALUES
('contrarian', 'A maioria está errada sobre [tema].'),
('confissao', 'Por anos eu fiz [coisa] do jeito errado.'),
('dado', '87% dos [grupo] erram nisso — e nem percebem.'),
('lista', '5 lições que custaram caro para eu aprender:'),
('pergunta', 'E se [crença comum] fosse exatamente o que está te travando?');
