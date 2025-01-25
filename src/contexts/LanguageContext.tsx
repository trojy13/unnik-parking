import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'el';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    customers: "Customers",
    parkingSpaces: "Parking Spaces",
    calendar: "Calendar",
    addCustomer: "Add Customer",
    name: "Name",
    licensePlate: "License Plate",
    payment: "Payment",
    monthlyFee: "Monthly Fee",
    discount: "Discount",
    parkingSpace: "Parking Space",
    duration: "Duration",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    language: "Language",
    status: "Status",
    occupied: "Occupied",
    available: "Available",
    expires: "Expires",
    search: "Search",
    noCustomers: "No customers found",
    addNew: "Add New",
    settings: "Settings",
    dashboard: "Dashboard",
  },
  el: {
    customers: "Πελάτες",
    parkingSpaces: "Θέσεις Στάθμευσης",
    calendar: "Ημερολόγιο",
    addCustomer: "Προσθήκη Πελάτη",
    name: "Όνομα",
    licensePlate: "Πινακίδα",
    payment: "Πληρωμή",
    monthlyFee: "Μηνιαίο Μίσθωμα",
    discount: "Έκπτωση",
    parkingSpace: "Θέση Στάθμευσης",
    duration: "Διάρκεια",
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    edit: "Επεξεργασία",
    delete: "Διαγραφή",
    language: "Γλώσσα",
    status: "Κατάσταση",
    occupied: "Κατειλημμένο",
    available: "Διαθέσιμο",
    expires: "Λήξη",
    search: "Αναζήτηση",
    noCustomers: "Δεν βρέθηκαν πελάτες",
    addNew: "Προσθήκη",
    settings: "Ρυθμίσεις",
    dashboard: "Πίνακας Ελέγχου",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('el');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};