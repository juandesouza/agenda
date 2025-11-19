'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    const isClient = typeof window !== 'undefined';
    const isProduction = process.env.NODE_ENV === 'production';

    if (!isClient || !isProduction || !('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch((error) => {
        console.error('Notification permission request failed:', error);
      });
    }
  }, []);

  return null;
}

