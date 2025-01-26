import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { format, addMonths, parse } from 'date-fns';

interface CustomerFormData {
  name: string;
  carType: string;
  carSize: 'small' | 'medium' | 'big';
  licensePlate: string;
  payment: number;
  monthlyFee: number;
  parkingSpace: string;
  expiryDate: string;
  paymentDate: string;
  paymentMethod: 'cash' | 'visa' | 'iris' | 'bank' | 'other';
  startDate: string;
  keyId: string;
  notes: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  onSave: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: CustomerFormData | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: initialData || {
      name: '',
      carType: '',
      carSize: 'medium',
      licensePlate: '',
      payment: 0,
      monthlyFee: 0,
      parkingSpace: '',
      paymentDate: format(new Date(), 'dd/MM/yyyy'),
      startDate: format(new Date(), 'dd/MM/yyyy'),
      expiryDate: format(new Date(), 'dd/MM/yyyy'),
      paymentMethod: 'cash',
      keyId: '',
      notes: '',
      phone: '',
      email: ''
    }
  });

  const payment = watch('payment');
  const monthlyFee = watch('monthlyFee');
  const startDate = watch('startDate');

  React.useEffect(() => {
    if (payment && monthlyFee && startDate) {
      try {
        const startDateObj = parse(startDate, 'dd/MM/yyyy', new Date());
        const months = Math.floor(payment / monthlyFee);
        const expiryDateObj = addMonths(startDateObj, months);
        setValue('expiryDate', format(expiryDateObj, 'dd/MM/yyyy'));
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }
  }, [payment, monthlyFee, startDate, setValue]);

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            <Input {...register('name')} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('carType')}</label>
            <Input {...register('carType')} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('carSize')}</label>
            <select {...register('carSize')} className="w-full border rounded-md p-2">
              <option value="small">{t('small')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="big">{t('big')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('licensePlate')}</label>
            <Input {...register('licensePlate')} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('payment')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('payment', { min: 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('monthlyFee')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('monthlyFee', { min: 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('parkingSpace')}</label>
            <Input {...register('parkingSpace')} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('paymentDate')}</label>
            <Input {...register('paymentDate')} placeholder="DD/MM/YYYY" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('startDate')}</label>
            <Input {...register('startDate')} placeholder="DD/MM/YYYY" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('expiryDate')}</label>
            <Input {...register('expiryDate')} placeholder="DD/MM/YYYY" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('paymentMethod')}</label>
            <select {...register('paymentMethod')} className="w-full border rounded-md p-2">
              <option value="cash">{t('cash')}</option>
              <option value="visa">{t('visa')}</option>
              <option value="iris">{t('iris')}</option>
              <option value="bank">{t('bank')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('keyId')}</label>
            <Input {...register('keyId')} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('phone')}</label>
            <Input {...register('phone')} type="tel" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('email')}</label>
            <Input {...register('email')} type="email" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('notes')}</label>
          <Textarea {...register('notes')} className="min-h-[100px]" />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit">
            {t('save')}
          </Button>
        </div>
      </form>
    </Card>
  );
};