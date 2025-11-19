'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  clearActiveEvent,
} from '@/lib/redux/slices/calendarSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { pt } from 'date-fns/locale/pt';
import { fr } from 'date-fns/locale/fr';
import { it } from 'date-fns/locale/it';
import { enUS } from 'date-fns/locale/en-US';

export function EventModal({ isOpen, onClose, selectedSlot }) {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { activeEvent, loading } = useAppSelector((state) => state.calendar);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [authWarning, setAuthWarning] = useState('');

  const localeMap = {
    en: enUS,
    es: es,
    pt: pt,
    fr: fr,
    it: it,
  };

  useEffect(() => {
    if (activeEvent) {
      setFormData({
        title: activeEvent.title,
        start: new Date(activeEvent.start),
        end: new Date(activeEvent.end),
        notes: activeEvent.notes || '',
      });
    } else if (selectedSlot) {
      setFormData({
        title: '',
        start: selectedSlot.start,
        end: selectedSlot.end,
        notes: '',
      });
    }
  }, [activeEvent, selectedSlot]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('required');
    }

    if (formData.end <= formData.start) {
      newErrors.end = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const serializeEventData = (data) => ({
    ...data,
    start: data.start instanceof Date ? data.start.toISOString() : data.start,
    end: data.end instanceof Date ? data.end.toISOString() : data.end,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user) {
      setAuthWarning('Create a free account to save your events.');
      router.push('/auth/register');
      return;
    }

    const payload = serializeEventData(formData);

    if (activeEvent) {
      await dispatch(updateEvent({ id: activeEvent.id, eventData: payload }));
    } else {
      await dispatch(createEvent(payload));
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (activeEvent && window.confirm(t('deleteEvent') + '?')) {
      await dispatch(deleteEvent(activeEvent.id));
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000),
      notes: '',
    });
    setErrors({});
    dispatch(clearActiveEvent());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border border-slate-200/80 bg-white/95 dark:border-slate-700/70 dark:bg-slate-900/90 dark:text-foreground">
        <DialogHeader>
          <DialogTitle>
            {activeEvent ? t('editEvent') : t('createEvent')}
          </DialogTitle>
          <DialogDescription>
            {activeEvent
              ? 'Update your event details'
              : 'Fill in the details to create a new event'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t('title')} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Event title"
              className="mt-1"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">{t('start')} *</Label>
              <DatePicker
                selected={formData.start}
                onChange={(date) => {
                  setFormData({ ...formData, start: date || new Date() });
                  if (errors.start) setErrors({ ...errors, start: '' });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                locale={localeMap[i18n.language] || enUS}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                wrapperClassName="w-full"
              />
              {errors.start && (
                <p className="mt-1 text-sm text-red-600">{errors.start}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end">{t('end')} *</Label>
              <DatePicker
                selected={formData.end}
                onChange={(date) => {
                  setFormData({ ...formData, end: date || new Date() });
                  if (errors.end) setErrors({ ...errors, end: '' });
                }}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="Pp"
                locale={localeMap[i18n.language] || enUS}
                minDate={formData.start}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                wrapperClassName="w-full"
              />
              {errors.end && (
                <p className="mt-1 text-sm text-red-600">{errors.end}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes..."
              className="mt-1"
              rows={3}
            />
          </div>

          {authWarning && (
            <p className="text-sm text-amber-500">{authWarning}</p>
          )}

          <DialogFooter>
            {activeEvent && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {t('delete')}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

