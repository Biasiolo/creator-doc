import { create } from "zustand";

interface WizardState {
  documentTypeId: string | null;
  step: number;
  data: Record<string, unknown>;
  setDocumentType: (id: string) => void;
  setStep: (step: number) => void;
  mergeData: (values: Record<string, unknown>) => void;
  reset: () => void;
}

/** Estado do assistente de criação (multi-etapas). */
export const useWizardStore = create<WizardState>((set) => ({
  documentTypeId: null,
  step: 0,
  data: {},
  setDocumentType: (id) =>
    set((state) => (state.documentTypeId === id ? state : { documentTypeId: id, step: 0, data: {} })),
  setStep: (step) => set({ step }),
  mergeData: (values) => set((state) => ({ data: { ...state.data, ...values } })),
  reset: () => set({ documentTypeId: null, step: 0, data: {} }),
}));
