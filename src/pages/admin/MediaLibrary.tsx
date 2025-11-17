import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Media library interface will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
