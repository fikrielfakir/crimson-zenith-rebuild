import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, Info } from 'lucide-react';

export default function EmailCampaigns() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Campaigns</h1>
        <p className="text-muted-foreground mt-1">Manage and send email campaigns to your members</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This feature is under development</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Email Campaigns module will allow you to compose and send bulk emails to your
            registered members, segmented by role, club membership, or event attendance.
          </p>

          <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Planned features
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Compose rich-text emails with a visual editor</li>
              <li>Target all users, members, or specific clubs</li>
              <li>Schedule campaigns for a future date and time</li>
              <li>Track open rates, click-through rates, and unsubscribes</li>
              <li>Manage unsubscribe lists to stay compliant</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-300">
            <Mail className="h-5 w-5 shrink-0" />
            <span>
              To send transactional emails right now (booking confirmations, welcome emails),
              configure your SMTP credentials in the <strong>Laravel .env</strong> file on Hostinger.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
