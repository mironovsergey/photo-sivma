import axios, { type AxiosProgressEvent } from 'axios';
import type { OrderResponse, UploadProgress } from '../types';
import { config } from '../config/env';

class ApiService {
  private initDataRaw: string = '';

  setInitData(initDataRaw: string) {
    this.initDataRaw = initDataRaw;
  }

  private getHeaders() {
    return {
      'x-telegram-init-data': this.initDataRaw,
    };
  }

  async uploadPhotos(
    files: File[],
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<OrderResponse> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('photos', file);
    });

    const response = await axios.post<OrderResponse>(`${config.api.baseUrl}/api/upload`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);

          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return response.data;
  }

  async getOrder(orderNumber: string): Promise<OrderResponse> {
    const response = await axios.get<OrderResponse>(
      `${config.api.baseUrl}/api/orders/${orderNumber}`,
      {
        headers: this.getHeaders(),
      },
    );

    return response.data;
  }
}

export default new ApiService();
