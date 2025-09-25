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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  Users,
  Trash2,
  Download,
  MoreHorizontal
} from "lucide-react";
import type { ClubApplication } from "@/types/admin";

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState<ClubApplication[]>([
    {
      id: 1,
      clubId: 1,
      applicantName: "Sofia Rodriguez",
      email: "sofia.rodriguez@email.com",
      phone: "+212 655 987 654",
      preferredClub: "Atlas Hikers Club",
      interests: ["Mountain Trekking", "Photography", "Nature Conservation"],
      motivation: "I've always been passionate about mountain hiking and would love to explore Morocco's Atlas Mountains with experienced guides. I have 5+ years of hiking experience and am looking to challenge myself with more technical routes while contributing to conservation efforts.",
      answers: {
        experience: "5+ years hiking experience",
        availability: "Weekends and holidays",
        fitness: "Very good - regular hiking and gym"
      },
      status: "submitted",
      createdAt: "2024-12-24T09:30:00Z",
      updatedAt: "2024-12-24T09:30:00Z"
    },
    {
      id: 2,
      applicantName: "Ahmed Hassan",
      email: "ahmed.hassan@email.com", 
      phone: "+212 661 123 456",
      preferredClub: "Photography Collective",
      interests: ["Photography", "Cultural Tours", "Historical Sites"],
      motivation: "As a professional photographer, I'm excited about capturing Morocco's diverse landscapes and culture. I'd love to share my technical knowledge while learning from local perspectives and hidden gems only the community knows about.",
      answers: {
        experience: "Professional photographer - 8 years",
        equipment: "Full frame camera, various lenses, drone",
        portfolio: "https://ahmedhassan-photography.com"
      },
      status: "under_review",
      reviewedBy: 1,
      reviewedAt: "2024-12-23T14:20:00Z",
      notes: "Excellent portfolio, considering for advanced photography expeditions",
      createdAt: "2024-12-23T08:15:00Z",
      updatedAt: "2024-12-23T14:20:00Z"
    },
    {
      id: 3,
      applicantName: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "+212 662 789 123", 
      preferredClub: "Desert Explorers",
      interests: ["Desert Adventures", "Cultural Tours", "Meditation & Wellness"],
      motivation: "Having lived in various countries, I'm drawn to the spiritual and peaceful aspects of desert landscapes. I'd love to experience authentic Sahara camping and learn about Berber culture while sharing my meditation and wellness practices with fellow travelers.",
      answers: {
        experience: "Beginner in desert trekking, experienced in wellness retreats",
        languages: "English (native), Arabic (basic), French (intermediate)",
        interests: "Mindfulness, cultural exchange, sustainable travel"
      },
      status: "approved",
      reviewedBy: 2,
      reviewedAt: "2024-12-22T16:45:00Z",
      notes: "Great cultural sensitivity, approved for cultural immersion programs",
      createdAt: "2024-12-22T11:30:00Z",
      updatedAt: "2024-12-22T16:45:00Z"
    },
    {
      id: 4,
      applicantName: "Youssef Benali",
      email: "youssef.benali@email.com",
      phone: "+212 663 456 789",
      interests: ["Water Sports", "Coastal Adventures", "Local Cuisine"],
      motivation: "Born and raised in Casablanca, I want to explore Morocco's coast from a new perspective and share my local knowledge with international visitors.",
      answers: {
        experience: "Local resident, surfing for 10+ years",
        certifications: "Surf instructor, lifeguard certified",
        availability: "Flexible schedule, own transportation"
      },
      status: "rejected",
      reviewedBy: 1,
      reviewedAt: "2024-12-21T13:10:00Z",
      notes: "Profile doesn't match current club focus areas",
      createdAt: "2024-12-21T10:20:00Z",
      updatedAt: "2024-12-21T13:10:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClub, setFilterClub] = useState<string>('all');
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  const [viewingApplication, setViewingApplication] = useState<ClubApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const statusConfig = {
    submitted: { label: 'Submitted', color: 'bg-blue-500', icon: Clock },
    under_review: { label: 'Under Review', color: 'bg-yellow-500', icon: Eye },
    approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-500', icon: XCircle }
  };

  const clubs = [
    'Atlas Hikers Club',
    'Desert Explorers', 
    'Photography Collective',
    'Coastal Riders',
    'Culture Seekers'
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesClub = filterClub === 'all' || app.preferredClub === filterClub;
    return matchesSearch && matchesStatus && matchesClub;
  });

  const handleStatusChange = (applicationId: number, newStatus: ClubApplication['status'], notes?: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: newStatus,
            reviewedBy: 1, // Current user ID
            reviewedAt: new Date().toISOString(),
            notes: notes || app.notes,
            updatedAt: new Date().toISOString()
          }
        : app
    ));
    setViewingApplication(null);
    setReviewNotes('');
  };

  const handleBulkAction = (action: string) => {
    if (selectedApplications.length === 0) return;
    
    if (action === 'approve') {
      selectedApplications.forEach(id => handleStatusChange(id, 'approved', 'Bulk approved'));
    } else if (action === 'reject') {
      selectedApplications.forEach(id => handleStatusChange(id, 'rejected', 'Bulk rejected'));
    } else if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedApplications.length} applications?`)) {
        setApplications(prev => prev.filter(app => !selectedApplications.includes(app.id)));
      }
    }
    setSelectedApplications([]);
  };

  const toggleSelection = (applicationId: number) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const selectAll = () => {
    setSelectedApplications(
      selectedApplications.length === filteredApplications.length 
        ? [] 
        : filteredApplications.map(app => app.id)
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications Management</h1>
            <p className="text-muted-foreground mt-2">
              Review and manage club membership applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = applications.filter(app => app.status === status).length;
            const IconComponent = config.icon;
            return (
              <Card key={status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <IconComponent className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterClub} onValueChange={setFilterClub}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {clubs.map(club => (
                    <SelectItem key={club} value={club}>{club}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {selectedApplications.length} applications selected
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('approve')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('reject')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedApplications.length === filteredApplications.length}
                  onCheckedChange={selectAll}
                />
                <Label className="text-sm">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const statusInfo = statusConfig[application.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card key={application.id} className="transition-colors hover:bg-muted/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedApplications.includes(application.id)}
                            onCheckedChange={() => toggleSelection(application.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{application.applicantName}</h3>
                              <Badge 
                                variant="secondary"
                                className={`${statusInfo.color} text-white`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {application.phone}
                              </div>
                              {application.preferredClub && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {application.preferredClub}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(application.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1">
                                {application.interests.map(interest => (
                                  <Badge key={interest} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {application.notes && (
                              <div className="mt-3 p-3 bg-muted rounded-md">
                                <p className="text-sm">
                                  <strong>Admin Notes:</strong> {application.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingApplication(application)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Application Review Dialog */}
        {viewingApplication && (
          <Dialog open={!!viewingApplication} onOpenChange={() => setViewingApplication(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Review Application - {viewingApplication.applicantName}</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="py-4">
                <TabsList>
                  <TabsTrigger value="details">Application Details</TabsTrigger>
                  <TabsTrigger value="review">Review & Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{viewingApplication.applicantName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{viewingApplication.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{viewingApplication.phone}</span>
                        </div>
                        {viewingApplication.preferredClub && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{viewingApplication.preferredClub}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Applied: {new Date(viewingApplication.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <Badge className={statusConfig[viewingApplication.status].color}>
                            {statusConfig[viewingApplication.status].label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {viewingApplication.interests.map(interest => (
                          <Badge key={interest} variant="secondary">{interest}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Motivation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{viewingApplication.motivation}</p>
                    </CardContent>
                  </Card>

                  {Object.keys(viewingApplication.answers).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Additional Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(viewingApplication.answers).map(([key, value]) => (
                            <div key={key}>
                              <p className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                              <p className="text-sm text-muted-foreground">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Review Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Add your review notes here..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                      
                      {viewingApplication.notes && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm">
                            <strong>Previous Notes:</strong> {viewingApplication.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setViewingApplication(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusChange(viewingApplication.id, 'under_review', reviewNotes)}
                      disabled={viewingApplication.status === 'under_review'}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleStatusChange(viewingApplication.id, 'rejected', reviewNotes)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(viewingApplication.id, 'approved', reviewNotes)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationsManagement;