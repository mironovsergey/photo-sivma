import { useEffect, useState } from 'react';
import {
  init,
  retrieveLaunchParams,
  miniApp,
  viewport,
  initData,
  type User,
} from '@telegram-apps/sdk';

interface TelegramState {
  isReady: boolean;
  user: User | undefined;
  initDataRaw: string;
}

export function useTelegram() {
  const [state, setState] = useState<TelegramState>({
    isReady: false,
    user: undefined,
    initDataRaw: '',
  });

  useEffect(() => {
    try {
      init();

      if (miniApp.mountSync.isAvailable()) {
        miniApp.mountSync();
        miniApp.ready();
      }

      if (viewport.mount.isAvailable()) {
        viewport.mount();

        if (viewport.expand.isAvailable()) {
          viewport.expand();
        }
      }

      const launchParams = retrieveLaunchParams();
      const userData = initData.user();
      const initDataRaw = initData.raw();

      setState({
        isReady: true,
        user: userData,
        initDataRaw: initDataRaw || '',
      });

      console.log('Telegram SDK инициализирован', {
        user: userData,
        launchParams,
      });
    } catch (error) {
      console.warn('Не удалось инициализировать Telegram SDK:', error);

      setState({
        isReady: true,
        user: undefined,
        initDataRaw: '',
      });
    }
  }, []);

  return {
    isReady: state.isReady,
    user: state.user,
    initDataRaw: state.initDataRaw,
  };
}
