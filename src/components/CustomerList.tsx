import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Search, Plus, Edit2, Trash2, FileDown, ArrowUpDown } from 'lucide-react';
import { CustomerForm } from './CustomerForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Customer {
  id: string;
  name: string;
  licensePlate: string;
  payment: number;
  monthlyFee: number;
  parkingSpace: string;
  expiryDate: string;
  paymentDate: string;
  paymentMethod: 'cash' | 'visa' | 'iris' | 'bank' | 'other';
  startDate: string;
  keyId: string;
}

type SortField = 'name' | 'id' | 'parkingSpace' | 'startDate' | 'expiryDate';
type SortOrder = 'asc' | 'desc';

export const CustomerList: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    autoTable(doc, {
      head: [[
        t('name'),
        t('licensePlate'),
        t('payment'),
        t('monthlyFee'),
        t('parkingSpace'),
        t('paymentDate'),
        t('startDate'),
        t('expiryDate'),
        t('keyId')
      ]],
      body: customers.map(customer => [
        customer.name,
        customer.licensePlate,
        `€${customer.payment}`,
        `€${customer.monthlyFee}`,
        customer.parkingSpace,
        customer.paymentDate,
        customer.startDate,
        customer.expiryDate,
        customer.keyId
      ]),
    });

    doc.save('customers.pdf');
  };

  const sortCustomers = (a: Customer, b: Customer) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'id':
        comparison = a.id.localeCompare(b.id);
        break;
      case 'parkingSpace':
        comparison = a.parkingSpace.localeCompare(b.parkingSpace);
        break;
      case 'startDate':
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case 'expiryDate':
        comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  };

  const filteredCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortCustomers);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={viewMode} onValueChange={(value: 'cards' | 'table') => setViewMode(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('viewMode')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cards">{t('cards')}</SelectItem>
              <SelectItem value="table">{t('table')}</SelectItem>
            </SelectContent>
          </Select>
          {viewMode === 'table' && (
            <>
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('name')}</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="parkingSpace">{t('parkingSpace')}</SelectItem>
                  <SelectItem value="startDate">{t('startDate')}</SelectItem>
                  <SelectItem value="expiryDate">{t('expiryDate')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: SortOrder) => setSortOrder(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t('ascending')}</SelectItem>
                  <SelectItem value="desc">{t('descending')}</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Button onClick={exportToPDF} variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            {t('exportPDF')}
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('addNew')}
          </Button>
        </div>
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

      {viewMode === 'table' ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('licensePlate')}</TableHead>
                <TableHead>{t('payment')}</TableHead>
                <TableHead>{t('monthlyFee')}</TableHead>
                <TableHead>{t('parkingSpace')}</TableHead>
                <TableHead>{t('startDate')}</TableHead>
                <TableHead>{t('expiryDate')}</TableHead>
                <TableHead>{t('keyId')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.licensePlate}</TableCell>
                  <TableCell>€{customer.payment}</TableCell>
                  <TableCell>€{customer.monthlyFee}</TableCell>
                  <TableCell>{customer.parkingSpace}</TableCell>
                  <TableCell>{customer.startDate}</TableCell>
                  <TableCell>{customer.expiryDate}</TableCell>
                  <TableCell>{customer.keyId}</TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
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
                  <p className="text-gray-500">{t('paymentMethod')}</p>
                  <p>{t(customer.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('startDate')}</p>
                  <p>{customer.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('expiryDate')}</p>
                  <p>{customer.expiryDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('keyId')}</p>
                  <p>{customer.keyId}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t('noCustomers')}
        </div>
      )}
    </div>
  );
};