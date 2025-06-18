import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Bell, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { reminderService, subscriptionService } from '../lib/database';
import type { Reminder, Subscription } from '../types';

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [remindersData, subscriptionsData] = await Promise.all([
        reminderService.getAll(),
        subscriptionService.getAll()
      ]);
      setReminders(remindersData);
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'all') return true;
    return reminder.status === filter;
  });

  const columns = [
    {
      key: 'subscription',
      title: 'Subscription',
      render: (value: any, record: Reminder) => (
        <div>
          <p className="font-medium">{record.subscription?.customer?.name || 'Unknown Customer'}</p>
          <p className="text-sm text-gray-500">{record.subscription?.product?.name || 'Unknown Product'}</p>
        </div>
      ),
    },
    {
      key: 'reminder_date',
      title: 'Reminder Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      ),
    },
    {
      key: 'sent_at',
      title: 'Sent At',
      render: (value: string) => value ? new Date(value).toLocaleString() : 'Not sent',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Reminder) => (
        <div className="flex space-x-2">
          {record.status === 'pending' && (
            <button
              onClick={() => handleMarkAsSent(record.id)}
              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
              title="Mark as sent"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
            title="Edit reminder"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
            title="Delete reminder"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder? This action cannot be undone.')) {
      try {
        // Note: We'll need to add a delete method to reminderService
        alert('Delete functionality will be implemented with the reminder service.');
        await loadData();
      } catch (error) {
        console.error('Error deleting reminder:', error);
        alert('Error deleting reminder. Please try again.');
      }
    }
  };

  const handleMarkAsSent = async (id: string) => {
    try {
      await reminderService.markAsSent(id);
      await loadData();
      alert('Reminder marked as sent successfully.');
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      alert('Error updating reminder status. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  const handleSaveReminder = async () => {
    await loadData();
    handleCloseModal();
  };

  const generateReminders = async () => {
    try {
      // This would typically be handled by a background job
      // For now, we'll show a placeholder message
      alert('Reminder generation will be implemented as a background process.');
    } catch (error) {
      console.error('Error generating reminders:', error);
      alert('Error generating reminders. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage subscription renewal reminders and notifications.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={generateReminders}>
            <Bell className="h-4 w-4 mr-2" />
            Generate Reminders
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Reminders' },
            { key: 'pending', label: 'Pending' },
            { key: 'sent', label: 'Sent' },
            { key: 'failed', label: 'Failed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.key === 'all' ? reminders.length : reminders.filter(r => r.status === tab.key).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <Table 
        columns={columns} 
        data={filteredReminders} 
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingReminder ? 'Edit Reminder' : 'Add Reminder'}
        size="lg"
      >
        <ReminderForm
          reminder={editingReminder}
          subscriptions={subscriptions}
          onSave={handleSaveReminder}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

function ReminderForm({ 
  reminder, 
  subscriptions, 
  onSave, 
  onClose 
}: { 
  reminder: Reminder | null; 
  subscriptions: Subscription[];
  onSave: () => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    subscription_id: reminder?.subscription_id || '',
    reminder_date: reminder?.reminder_date || new Date().toISOString().split('T')[0],
    type: reminder?.type || 'email' as const,
    status: reminder?.status || 'pending' as const,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subscription_id) {
      newErrors.subscription_id = 'Subscription is required';
    }
    
    if (!formData.reminder_date) {
      newErrors.reminder_date = 'Reminder date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Note: We'll need to implement create/update methods in reminderService
      alert('Reminder save functionality will be implemented with the reminder service.');
      onSave();
    } catch (error: any) {
      console.error('Error saving reminder:', error);
      alert('Error saving reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subscription <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.subscription_id}
            onChange={(e) => setFormData({ ...formData, subscription_id: e.target.value })}
            className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subscription_id ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
          >
            <option value="">Select a subscription</option>
            {subscriptions.map((subscription) => (
              <option key={subscription.id} value={subscription.id}>
                {subscription.customer?.name} - {subscription.product?.name}
              </option>
            ))}
          </select>
          {errors.subscription_id && <p className="mt-1 text-sm text-red-600">{errors.subscription_id}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reminder Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.reminder_date}
            onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
            className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.reminder_date ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {errors.reminder_date && <p className="mt-1 text-sm text-red-600">{errors.reminder_date}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : reminder ? 'Update Reminder' : 'Create Reminder'}
        </Button>
      </div>
    </form>
  );
}