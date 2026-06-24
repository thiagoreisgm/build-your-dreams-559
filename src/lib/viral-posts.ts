// Shared viral posts catalog (mock). When backend lands this becomes a query
// against `viral_posts` (or whatever the table ends up being called).

export type ViralPost = {
  id: string;
  author: string;
  structure: "contrarian" | "história" | "lista";
  lang: "pt" | "en";
  text: string;
  translation?: string;
  likes: number;
  comments: number;
};

export const MOCK_VIRAL_POSTS: ViralPost[] = [
  {
    id: "1",
    author: "Jani Vrancsik",
    structure: "contrarian",
    lang: "en",
    text:
      "We built our first AI agent to better handle our email + LinkedIn motions. Now you can kill 80% of your repetitive work too, with these:",
    translation:
      "Construímos nosso primeiro agente de IA pra dar conta das nossas ações de e-mail + LinkedIn. Agora você também mata 80% do trabalho repetitivo com isto:",
    likes: 94,
    comments: 12,
  },
  {
    id: "2",
    author: "Camila Ferraz",
    structure: "história",
    lang: "pt",
    text:
      '"Demitir meu melhor vendedor foi a decisão que dobrou minha receita. Parece loucura, mas..."',
    likes: 214,
    comments: 38,
  },
  {
    id: "3",
    author: "Ravi Shrivas",
    structure: "contrarian",
    lang: "en",
    text:
      "Most B2B companies aren't behind on AI because they lack tools. They're behind because they don't have a system.",
    translation:
      "A maioria das empresas B2B não está atrasada em IA por falta de ferramenta. Estão atrasadas porque não têm um sistema.",
    likes: 175,
    comments: 52,
  },
];

export function getViralPostById(id: string): ViralPost | undefined {
  return MOCK_VIRAL_POSTS.find((p) => p.id === id);
}
