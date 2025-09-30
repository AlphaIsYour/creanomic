import { create } from "zustand";

interface RegistrationState {
  isSubmitting: boolean;
  uploadProgress: number;
  uploadedFiles: string[];
  setSubmitting: (status: boolean) => void;
  setUploadProgress: (progress: number) => void;
  addUploadedFile: (url: string) => void;
  clearUploadedFiles: () => void;
  resetStore: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  isSubmitting: false,
  uploadProgress: 0,
  uploadedFiles: [],

  setSubmitting: (status) => set({ isSubmitting: status }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  addUploadedFile: (url) =>
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, url],
    })),

  clearUploadedFiles: () => set({ uploadedFiles: [] }),

  resetStore: () =>
    set({
      isSubmitting: false,
      uploadProgress: 0,
      uploadedFiles: [],
    }),
}));
