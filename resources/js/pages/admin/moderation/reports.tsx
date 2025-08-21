import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Eye, Flag, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

interface JobReport {
  id: number;
  reason: string;
  description?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  reporter: {
    name: string;
    email: string;
  };
  reviewer?: {
    name: string;
  };
  job_listing: {
    id: number;
    title: string;
    company: {
      name: string;
    };
  };
}

interface Props {
  reports: {
    data: JobReport[];
    current_page: number;
    last_page: number;
  };
  filters: {
    status?: string;
    reason?: string;
  };
}

export default function ReportsModeration({ reports, filters }: Props) {
  const [status, setStatus] = useState(filters.status || 'all');
  const [reason, setReason] = useState(filters.reason || 'all');
  const [reportModal, setReportModal] = useState<{
    report: JobReport | null;
    status: string;
    adminNotes: string;
    jobAction: string;
  }>({
    report: null,
    status: 'resolved',
    adminNotes: '',
    jobAction: '',
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      reviewed: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      dismissed: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', icon: Flag };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getReasonColor = (reason: string) => {
    const reasonColors = {
      'spam': 'bg-red-100 text-red-800',
      'inappropriate': 'bg-orange-100 text-orange-800',
      'fake': 'bg-purple-100 text-purple-800',
      'misleading': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    
    return reasonColors[reason as keyof typeof reasonColors] || 'bg-gray-100 text-gray-800';
  };

  const handleFilter = () => {
    router.get(route('admin.moderation.reports'), {
      status: status === 'all' ? undefined : status || undefined,
      reason: reason === 'all' ? undefined : reason || undefined,
    });
  };

  const openReportModal = (report: JobReport) => {
    setReportModal({
      report,
      status: 'resolved',
      adminNotes: '',
      jobAction: '',
    });
  };

  const handleReportResolution = () => {
    if (!reportModal.report) return;
    
    router.patch(route('admin.moderation.resolve-report', reportModal.report.id), {
      status: reportModal.status,
      admin_notes: reportModal.adminNotes,
      job_action: reportModal.jobAction === 'none' ? undefined : reportModal.jobAction || undefined,
    }, {
      onSuccess: () => {
        setReportModal({ report: null, status: 'resolved', adminNotes: '', jobAction: '' });
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Reports Moderation" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports Moderation</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.data.length}</p>
                </div>
                <Flag className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reports.data.filter(report => report.status === 'pending').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reports.data.filter(report => report.status === 'resolved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dismissed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {reports.data.filter(report => report.status === 'dismissed').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate</SelectItem>
                  <SelectItem value="fake">Fake Job</SelectItem>
                  <SelectItem value="misleading">Misleading</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleFilter} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.data.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getReasonColor(report.reason)}>
                          {report.reason}
                        </Badge>
                        {getStatusBadge(report.status)}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReportModal(report)}
                        disabled={report.status === 'resolved' || report.status === 'dismissed'}
                      >
                        {report.status === 'pending' ? 'Review' : 'View'}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-blue-600">
                        {report.job_listing.title} - {report.job_listing.company.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Reported by: {report.reporter.name} ({report.reporter.email})
                      </div>
                      <div className="text-xs text-gray-500">
                        Reported: {new Date(report.created_at).toLocaleDateString()}
                      </div>
                      
                      {report.description && (
                        <div className="text-sm bg-gray-100 p-3 rounded">
                          <strong>Description:</strong> {report.description}
                        </div>
                      )}
                      
                      {report.reviewed_at && report.reviewer && (
                        <div className="text-xs text-gray-500">
                          Reviewed by {report.reviewer.name} on {new Date(report.reviewed_at).toLocaleDateString()}
                        </div>
                      )}
                      
                      {report.admin_notes && (
                        <div className="text-sm bg-blue-50 p-3 rounded">
                          <strong>Admin Notes:</strong> {report.admin_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reports.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reports found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Resolution Modal */}
        {reportModal.report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Resolve Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Report about "{reportModal.report.job_listing.title}" by {reportModal.report.reporter.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Reason:</strong> {reportModal.report.reason}</p>
                  {reportModal.report.description && (
                    <p className="mt-1"><strong>Description:</strong> {reportModal.report.description}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Resolution</label>
                  <Select 
                    value={reportModal.status} 
                    onValueChange={(value) => setReportModal(prev => ({...prev, status: value}))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resolved">Resolve (Valid Report)</SelectItem>
                      <SelectItem value="dismissed">Dismiss (Invalid Report)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reportModal.status === 'resolved' && (
                  <div>
                    <label className="text-sm font-medium">Action on Job Listing</label>
                    <Select 
                      value={reportModal.jobAction} 
                      onValueChange={(value) => setReportModal(prev => ({...prev, jobAction: value}))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select action (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Action</SelectItem>
                        <SelectItem value="reject">Reject Job Listing</SelectItem>
                        <SelectItem value="suspend">Suspend Job Listing</SelectItem>
                        <SelectItem value="approve">Keep Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea
                    value={reportModal.adminNotes}
                    onChange={(e) => setReportModal(prev => ({...prev, adminNotes: e.target.value}))}
                    placeholder="Add notes about the resolution..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleReportResolution} className="flex-1">
                    Resolve Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setReportModal({ report: null, status: 'resolved', adminNotes: '', jobAction: '' })}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}