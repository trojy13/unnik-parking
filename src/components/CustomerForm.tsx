import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useForm } from 'react-hook-form';
import { format, addMonths } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CustomerFormData {
  name: string;
  licensePlate: string;
  payment: number;
  monthlyFee: number;
  discount: number;
  discountType: 'percentage' | 'monthly' | 'total';
  parkingSpace: string;
  expiryDate: string;
  paymentDate: string;
  paymentMethod: 'cash' | 'visa' | 'iris' | 'bank' | 'other';
  startDate: string;
  keyId: string;
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
      licensePlate: '',
      payment: 0,
      monthlyFee: 0,
      discount: 0,
      discountType: 'percentage',
      parkingSpace: '',
      paymentDate: format(new Date(), 'dd/MM/yyyy'),
      startDate: format(new Date(), 'dd/MM/yyyy'),
      expiryDate: format(new Date(), 'dd/MM/yyyy'),
      paymentMethod: 'cash',
      keyId: ''
    }
  });

  const payment = watch('payment');
  const monthlyFee = watch('monthlyFee');
  const startDate = watch('startDate');
  const discount = watch('discount');
  const discountType = watch('discountType');

  React.useEffect(() => {
    if (payment && monthlyFee && startDate) {
      let effectiveMonthlyFee = monthlyFee;
      
      // Apply discount based on type
      if (discountType === 'percentage') {
        effectiveMonthlyFee = monthlyFee * (1 - discount / 100);
      } else if (discountType === 'monthly') {
        effectiveMonthlyFee = monthlyFee - discount;
      } else if (discountType === 'total') {
        effectiveMonthlyFee = monthlyFee - (discount / Math.floor(payment / monthlyFee));
      }

      const months = Math.floor(payment / effectiveMonthlyFee);
      const startDateObj = new Date(startDate.split('/').reverse().join('-'));
      const expiryDateObj = addMonths(startDateObj, months);
      setValue('expiryDate', format(expiryDateObj, 'dd/MM/yyyy'));
    }
  }, [payment, monthlyFee, startDate, discount, discountType, setValue]);

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            <Input {...register('name', { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{t('required')}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('licensePlate')}</label>
            <Input {...register('licensePlate', { required: true })} />
            {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{t('required')}</p>}
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
            <label className="block text-sm font-medium mb-1">{t('discountType')}</label>
            <select {...register('discountType')} className="w-full border rounded-md p-2">
              <option value="percentage">{t('percentage')}</option>
              <option value="monthly">{t('monthlyAmount')}</option>
              <option value="total">{t('totalAmount')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('parkingSpace')}</label>
            <Input {...register('parkingSpace', { required: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('paymentDate')}</label>
            <Input {...register('paymentDate', { required: true })} placeholder="DD/MM/YYYY" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('startDate')}</label>
            <Input {...register('startDate', { required: true })} placeholder="DD/MM/YYYY" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('expiryDate')}</label>
            <Input {...register('expiryDate')} readOnly placeholder="DD/MM/YYYY" />
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
            <Input {...register('keyId', { required: true })} />
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