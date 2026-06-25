import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ComposerAutoAction = "ideas" | "write_post" | "hooks" | "improve";

type OpenOpts = { inspirationId?: string | null; autoAction?: ComposerAutoAction | null };

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  inspirationId: string | null;
  autoAction: ComposerAutoAction | null;
  openWith: (opts?: OpenOpts) => void;
  consumeAutoAction: () => ComposerAutoAction | null;
};

const ComposerContext = createContext<Ctx | null>(null);

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const [inspirationId, setInspirationId] = useState<string | null>(null);
  const [autoAction, setAutoAction] = useState<ComposerAutoAction | null>(null);

  const setOpen = useCallback((v: boolean) => {
    setOpenState(v);
    if (!v) {
      setInspirationId(null);
      setAutoAction(null);
    }
  }, []);

  const openWith = useCallback((opts?: OpenOpts) => {
    setInspirationId(opts?.inspirationId ?? null);
    setAutoAction(opts?.autoAction ?? null);
    setOpenState(true);
  }, []);

  const consumeAutoAction = useCallback(() => {
    const a = autoAction;
    setAutoAction(null);
    return a;
  }, [autoAction]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <ComposerContext.Provider
      value={{ open, setOpen, inspirationId, autoAction, openWith, consumeAutoAction }}
    >
      {children}
    </ComposerContext.Provider>
  );
}

const noopCtx: Ctx = {
  open: false,
  setOpen: () => {},
  inspirationId: null,
  autoAction: null,
  openWith: () => {},
  consumeAutoAction: () => null,
};

export function useComposer() {
  return useContext(ComposerContext) ?? noopCtx;
}

export function useOpenComposer() {
  const { openWith } = useComposer();
  return useCallback(() => openWith(), [openWith]);
}
