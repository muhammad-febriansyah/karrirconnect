import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, User, Briefcase, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface Application {
  id: number;
  status: string;
  cover_letter?: string;
  resume_path?: string;
  additional_documents?: string[];
  admin_notes?: string;
  applied_at: string;
  reviewed_at?: string;
  user: {
    name: string;
    email: string;
    user_profile?: {
      phone?: string;
      location?: string;
      bio?: string;
    };
  };
  job_listing: {
    title: string;
    description: string;
    requirements?: string;
    company: {
      name: string;
      description?: string;
    };
  };
  reviewer?: {
    name: string;
  };
}

interface Props {
  application: Application;
}

export default function ApplicationShow({ application }: Props) {
  const [status, setStatus] = useState(application.status);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      interviewed: 'bg-purple-100 text-purple-800',
      hired: 'bg-green-500 text-white',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const handleStatusUpdate = () => {
    setIsUpdating(true);
    router.patch(route('admin.applications.update-status', application.id), {
      status,
      admin_notes: adminNotes,
    }, {
      onFinish: () => setIsUpdating(false),
    });
  };

  return (
    <AppLayout>
      <Head title={`Application - ${application.user.name}`} />
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.get(route('admin.applications.index'))}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Applicant Information
                  </CardTitle>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg font-semibold">{application.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {application.user.email}
                    </p>
                  </div>
                  {application.user.user_profile?.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {application.user.user_profile.phone}
                      </p>
                    </div>
                  )}
                  {application.user.user_profile?.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {application.user.user_profile.location}
                      </p>
                    </div>
                  )}
                </div>
                
                {application.user.user_profile?.bio && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bio</label>
                    <p className="mt-1 text-gray-900">{application.user.user_profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-lg font-semibold">{application.job_listing.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {application.job_listing.company.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Description</label>
                  <div 
                    className="mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: application.job_listing.description }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {application.cover_letter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.resume_path && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Resume/CV</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
                
                {application.additional_documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{doc}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
                
                {!application.resume_path && (!application.additional_documents || application.additional_documents.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Application Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(application.applied_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {application.reviewed_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Reviewed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.reviewed_at).toLocaleString()}
                      </p>
                      {application.reviewer && (
                        <p className="text-sm text-gray-600">by {application.reviewer.name}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </CardContent>
            </Card>

            {/* Admin Notes History */}
            {application.admin_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{application.admin_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}