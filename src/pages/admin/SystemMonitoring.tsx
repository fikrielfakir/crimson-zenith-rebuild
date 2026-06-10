import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemMonitoring() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('admin.system.title')}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">System monitoring interface will be implemented here</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Database monitoring will be shown here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
