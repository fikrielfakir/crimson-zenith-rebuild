import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EmailCampaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Email campaigns interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
