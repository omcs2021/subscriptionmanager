import { supabase } from './supabase';
import type { Customer, Product, Category, Subscription, ReminderSettings, Reminder } from '../types';

// Customer operations
export const customerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Customer[];
  },

  async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data as Customer;
  },

  async update(id: string, customer: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Customer;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Category operations
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Category[];
  },

  async create(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Product operations
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async create(product: Omit<Product, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Subscription operations
export const subscriptionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customer:customers(*),
        product:products(*, category:categories(*))
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Subscription[];
  },

  async create(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select(`
        *,
        customer:customers(*),
        product:products(*, category:categories(*))
      `)
      .single();
    
    if (error) throw error;
    return data as Subscription;
  },

  async update(id: string, subscription: Partial<Subscription>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(subscription)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        product:products(*, category:categories(*))
      `)
      .single();
    
    if (error) throw error;
    return data as Subscription;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getExpiringSubscriptions(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customer:customers(*),
        product:products(*, category:categories(*))
      `)
      .eq('status', 'active')
      .lte('end_date', futureDate.toISOString().split('T')[0])
      .order('end_date');
    
    if (error) throw error;
    return data as Subscription[];
  }
};

// Reminder operations
export const reminderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        subscription:subscriptions(
          *,
          customer:customers(*),
          product:products(*)
        )
      `)
      .order('reminder_date', { ascending: false });
    
    if (error) throw error;
    return data as Reminder[];
  },

  async getPending() {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        subscription:subscriptions(
          *,
          customer:customers(*),
          product:products(*)
        )
      `)
      .eq('status', 'pending')
      .lte('reminder_date', new Date().toISOString().split('T')[0])
      .order('reminder_date');
    
    if (error) throw error;
    return data as Reminder[];
  },

  async markAsSent(id: string) {
    const { data, error } = await supabase
      .from('reminders')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Reminder;
  }
};

// Dashboard statistics
export const dashboardService = {
  async getStats() {
    const [
      customersResult,
      subscriptionsResult,
      productsResult,
      remindersResult
    ] = await Promise.all([
      supabase.from('customers').select('id', { count: 'exact' }),
      supabase.from('subscriptions').select('id, status', { count: 'exact' }),
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('reminders').select('id', { count: 'exact' }).eq('status', 'pending')
    ]);

    const activeSubscriptions = subscriptionsResult.data?.filter(s => s.status === 'active').length || 0;

    return {
      totalCustomers: customersResult.count || 0,
      activeSubscriptions,
      totalProducts: productsResult.count || 0,
      pendingReminders: remindersResult.count || 0
    };
  },

  async getRecentActivity() {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customer:customers(name),
        product:products(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  async getUpcomingRenewals() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        customer:customers(name),
        product:products(name, price)
      `)
      .eq('status', 'active')
      .lte('end_date', futureDate.toISOString().split('T')[0])
      .order('end_date')
      .limit(10);
    
    if (error) throw error;
    return data;
  }
};