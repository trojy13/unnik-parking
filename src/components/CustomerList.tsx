import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { CustomerForm } from './CustomerForm';

interface Customer {
  id: string;
  name: string;
  licensePlate: string;
  payment: number;
  monthlyFee: number;
  discount: number;
  parkingSpace: string;
  expiryDate: string;
}

export const CustomerList: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleSave = (customer: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...customer, id: editingCustomer.id }
          : c
      ));
    } else {
      setCustomers([...customers, { ...customer, id: Date.now().toString() }]);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('addNew')}
        </Button>
      </div>

      {showForm && (
        <CustomerForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          initialData={editingCustomer}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.licensePlate}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingCustomer(customer);
                    setShowForm(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(customer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">{t('payment')}</p>
                <p>€{customer.payment}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('monthlyFee')}</p>
                <p>€{customer.monthlyFee}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('parkingSpace')}</p>
                <p>{customer.parkingSpace}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('expires')}</p>
                <p>{new Date(customer.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t('noCustomers')}
        </div>
      )}
    </div>
  );
};