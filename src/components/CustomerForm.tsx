import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useForm } from 'react-hook-form';

interface CustomerFormData {
  name: string;
  licensePlate: string;
  payment: number;
  monthlyFee: number;
  discount: number;
  parkingSpace: string;
  expiryDate: string;
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
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: initialData || {
      name: '',
      licensePlate: '',
      payment: 0,
      monthlyFee: 0,
      discount: 0,
      parkingSpace: '',
      expiryDate: new Date().toISOString().split('T')[0]
    }
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            <Input {...register('name', { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Required</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('licensePlate')}</label>
            <Input {...register('licensePlate', { required: true })} />
            {errors.licensePlate && <p className="text-red-500 text-sm mt-1">Required</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('payment')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('payment', { required: true, min: 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('monthlyFee')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('monthlyFee', { required: true, min: 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('discount')}</label>
            <Input
              type="number"
              step="0.01"
              {...register('discount', { required: true, min: 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('parkingSpace')}</label>
            <Input {...register('parkingSpace', { required: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('duration')}</label>
            <Input
              type="date"
              {...register('expiryDate', { required: true })}
            />
          </div>
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