// File: src/pages/Subscription.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function Subscription() {
  const [subscription, setSubscription] = useState({
    name: '',
    startDate: '',
    frequency: 'monthly',
  });

  const handleChange = (field: string, value: string) => {
    setSubscription(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Send to Supabase
    console.log('Save subscription', subscription);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Subscription Name" value={subscription.name} onChange={e => handleChange('name', e.target.value)} />
        <Input type="date" value={subscription.startDate} onChange={e => handleChange('startDate', e.target.value)} />
        <Select value={subscription.frequency} onValueChange={val => handleChange('frequency', val)}>
          <SelectTrigger><SelectValue placeholder="Frequency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Every 15 Days</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Save</Button>
      </CardContent>
    </Card>
  );
}
