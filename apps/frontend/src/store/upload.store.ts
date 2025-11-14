import type { FileWithPreview, UploadProgress, UploadStatus } from '../types';
import { create } from 'zustand';

interface UploadStore {
  files: FileWithPreview[];
  status: UploadStatus;
  progress: UploadProgress | null;
  orderNumber: string | null;
  error: string | null;

  setFiles: (files: FileWithPreview[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  setStatus: (status: UploadStatus) => void;
  setProgress: (progress: UploadProgress | null) => void;
  setOrderNumber: (orderNumber: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  files: [],
  status: 'idle',
  progress: null,
  orderNumber: null,
  error: null,

  setFiles: (files) => set({ files }),

  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),

  clearFiles: () => set({ files: [] }),

  setStatus: (status) => set({ status }),

  setProgress: (progress) => set({ progress }),

  setOrderNumber: (orderNumber) => set({ orderNumber }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      files: [],
      status: 'idle',
      progress: null,
      orderNumber: null,
      error: null,
    }),
}));
