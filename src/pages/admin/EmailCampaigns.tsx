import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Send, 
  Users, 
  Mail,
  Calendar,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Settings
} from "lucide-react";

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotion' | 'announcement' | 'event';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  recipientCount: number;
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  createDate: string;
  scheduledDate?: string;
  sentDate?: string;
  content: string;
  previewText: string;
}

interface Subscriber {
  id: number;
  email: string;
  name: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedDate: string;
  tags: string[];
  lastEngagement?: string;
}

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 1,
      name: "Monthly Newsletter - December",
      subject: "Discover December Adventures in Morocco",
      type: "newsletter",
      status: "sent",
      recipientCount: 1250,
      sentCount: 1250,
      openRate: 68.5,
      clickRate: 12.3,
      createDate: "2024-12-01",
      sentDate: "2024-12-15",
      content: "Welcome to our December newsletter featuring winter adventures...",
      previewText: "Explore winter trekking and cultural events this month"
    },
    {
      id: 2,
      name: "New Year Event Promotion",
      subject: "Ring in 2025 with Epic Morocco Adventures!",
      type: "promotion",
      status: "scheduled",
      recipientCount: 980,
      createDate: "2024-12-20",
      scheduledDate: "2024-12-28",
      content: "Join us for spectacular New Year celebrations...",
      previewText: "Special New Year event offers inside"
    },
    {
      id: 3,
      name: "Atlas Trek Safety Update",
      subject: "Important Safety Guidelines for Winter Treks",
      type: "announcement",
      status: "draft",
      recipientCount: 0,
      createDate: "2024-12-24",
      content: "We want to ensure your safety during winter conditions...",
      previewText: "Updated safety guidelines for mountain activities"
    }
  ]);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: 1,
      email: "user1@example.com",
      name: "Ahmed Hassan",
      status: "active",
      subscribedDate: "2024-01-15",
      tags: ["newsletter", "events"],
      lastEngagement: "2024-12-20"
    },
    {
      id: 2,
      email: "user2@example.com", 
      name: "Fatima Zahra",
      status: "active",
      subscribedDate: "2024-03-22",
      tags: ["newsletter", "promotions"],
      lastEngagement: "2024-12-18"
    }
  ]);

  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    type: 'newsletter',
    status: 'draft',
    content: '',
    previewText: ''
  });

  const campaignTypes = ['newsletter', 'promotion', 'announcement', 'event'];
  const campaignStatuses = ['draft', 'scheduled', 'sent', 'paused'];

  const handleCreateCampaign = () => {
    if (!newCampaign.name?.trim() || !newCampaign.subject?.trim()) {
      alert('Campaign name and subject are required');
      return;
    }

    const nextId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
    
    const campaign: EmailCampaign = {
      id: nextId,
      name: newCampaign.name.trim(),
      subject: newCampaign.subject.trim(),
      type: newCampaign.type || 'newsletter',
      status: 'draft',
      recipientCount: 0,
      createDate: new Date().toISOString().split('T')[0],
      content: newCampaign.content || '',
      previewText: newCampaign.previewText || ''
    } as EmailCampaign;

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: '',
      subject: '',
      type: 'newsletter',
      status: 'draft',
      content: '',
      previewText: ''
    });
    setIsCreateCampaignOpen(false);
  };

  const handleSendCampaign = (campaignId: number) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: 'sent' as const,
            sentDate: new Date().toISOString().split('T')[0],
            sentCount: campaign.recipientCount,
            openRate: Math.random() * 30 + 50, // Mock data
            clickRate: Math.random() * 10 + 5
          }
        : campaign
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-purple-100 text-purple-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CampaignStats = () => {
    const totalSent = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const avgOpenRate = campaigns.filter(c => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length || 0;
    const avgClickRate = campaigns.filter(c => c.clickRate).reduce((sum, c) => sum + (c.clickRate || 0), 0) / campaigns.filter(c => c.clickRate).length || 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">Active subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Email opens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Email Campaigns</h1>
            <p className="text-muted-foreground">Create and manage email marketing campaigns</p>
          </div>
          <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Campaign Type</Label>
                    <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                    placeholder="Enter email subject line"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previewText">Preview Text</Label>
                  <Input
                    id="previewText"
                    value={newCampaign.previewText}
                    onChange={(e) => setNewCampaign({...newCampaign, previewText: e.target.value})}
                    placeholder="Preview text shown in email clients"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Email Content</Label>
                  <Textarea
                    id="content"
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                    placeholder="Enter email content..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignStats />

            {/* Campaigns List */}
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={getTypeColor(campaign.type)}>
                              {campaign.type}
                            </Badge>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Recipients:</span> {campaign.recipientCount.toLocaleString()}
                            </div>
                            {campaign.openRate && (
                              <div>
                                <span className="font-medium">Open Rate:</span> {campaign.openRate.toFixed(1)}%
                              </div>
                            )}
                            {campaign.clickRate && (
                              <div>
                                <span className="font-medium">Click Rate:</span> {campaign.clickRate.toFixed(1)}%
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Created:</span> {campaign.createDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {campaign.status === 'draft' && (
                            <Button size="sm" onClick={() => handleSendCampaign(campaign.id)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" 
                                  onClick={() => {
                                    if (confirm(`Delete campaign "${campaign.name}"?`)) {
                                      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
                                    }
                                  }}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscribers.filter(s => s.status === 'active').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscribers.filter(s => s.status === 'unsubscribed').length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+8.5%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscriber List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{subscriber.name}</div>
                        <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Subscribed: {subscriber.subscribedDate} • Last engagement: {subscriber.lastEngagement}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={subscriber.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {subscriber.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4" />
                  <p>Email templates feature coming soon</p>
                  <p className="text-sm">Create reusable templates for your campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Performance chart would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2" />
                      <p>Growth chart would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailCampaigns;