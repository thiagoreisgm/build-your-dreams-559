import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const ComposerContext = createContext<Ctx | null>(null);

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <ComposerContext.Provider value={{ open, setOpen }}>{children}</ComposerContext.Provider>
  );
}

export function useComposer() {
  const ctx = useContext(ComposerContext);
  if (!ctx) return { open: false, setOpen: () => {} } satisfies Ctx;
  return ctx;
}

export function useOpenComposer() {
  const { setOpen } = useComposer();
  return useCallback(() => setOpen(true), [setOpen]);
}
