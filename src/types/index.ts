export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  category?: Category;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  created_at: string;
}

export interface Subscription {
  id: string;
  customer_id: string;
  product_id: string;
  customer?: Customer;
  product?: Product;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderSettings {
  id: string;
  subscription_id: string;
  reminder_days: number[];
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  custom_message?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  subscription_id: string;
  reminder_date: string;
  type: 'email' | 'whatsapp';
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  created_at: string;
}