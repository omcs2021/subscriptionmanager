// File: src/pages/Reminder.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export default function Reminder() {
  const [reminder, setReminder] = useState({
    interval: '7',
    customDays: '',
    email: true,
    whatsapp: true,
  });

  const handleChange = (field: string, value: any) => {
    setReminder(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Save reminder', reminder);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Set Reminder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="block font-medium">Reminder Interval</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={reminder.interval}
          onChange={e => handleChange('interval', e.target.value)}
        >
          <option value="7">1 Week</option>
          <option value="15">15 Days</option>
          <option value="30">1 Month</option>
          <option value="custom">Custom</option>
        </select>
        {reminder.interval === 'custom' && (
          <Input
            type="number"
            placeholder="Enter custom days"
            value={reminder.customDays}
            onChange={e => handleChange('customDays', e.target.value)}
          />
        )}
        <div className="flex items-center space-x-4">
          <Checkbox checked={reminder.email} onCheckedChange={val => handleChange('email', val)} /> <span>Email</span>
          <Checkbox checked={reminder.whatsapp} onCheckedChange={val => handleChange('whatsapp', val)} /> <span>WhatsApp</span>
        </div>
        <Button onClick={handleSubmit}>Save Reminder</Button>
      </CardContent>
    </Card>
  );
}
