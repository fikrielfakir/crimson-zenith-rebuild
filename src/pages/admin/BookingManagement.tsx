import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BookingManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Booking management interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
