export interface OrderResponse {
  success: boolean;
  data: {
    orderNumber: string;
    photosCount: number;
    totalSize: number;
    expiresAt: string;
    createdAt: string;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileWithPreview extends File {
  preview?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
