'use client';

import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/redux/store';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { hydrateAuth, logout } from '@/lib/redux/slices/authSlice';

function ReduxInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        dispatch(hydrateAuth({ token: storedToken, user: JSON.parse(storedUser) }));
      } catch (error) {
        console.error('Failed to hydrate auth state', error);
      }
    }

    const handleForcedLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, [dispatch]);

  return children;
}

export function Providers({ children }) {
  useEffect(() => {
    // Initialize i18n
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, []);

  return (
    <Provider store={store}>
      <ReduxInitializer>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nextProvider>
      </ReduxInitializer>
    </Provider>
  );
}

