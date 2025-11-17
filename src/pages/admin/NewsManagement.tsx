import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function NewsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">News & Blog Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">News and blog management interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
