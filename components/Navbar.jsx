'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export function Navbar() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-base sm:text-xl font-bold">{t('calendar')}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">{user.name}</span>
              <div
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                style={{ backgroundColor: user.color }}
              />
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/login')}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                {t('login')}
              </Button>
              <Button 
                onClick={() => router.push('/auth/register')}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                {t('register')}
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 sm:h-10 sm:w-10">
            {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('english')}</SelectItem>
              <SelectItem value="es">{t('spanish')}</SelectItem>
              <SelectItem value="pt">{t('portuguese')}</SelectItem>
              <SelectItem value="fr">{t('french')}</SelectItem>
              <SelectItem value="it">{t('italian')}</SelectItem>
            </SelectContent>
          </Select>

          {user && (
            <Button variant="ghost" onClick={handleLogout} size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">{t('logout')}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

