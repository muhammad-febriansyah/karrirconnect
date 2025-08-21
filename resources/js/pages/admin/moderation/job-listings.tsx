import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

interface JobListing {
  id: number;
  title: string;
  moderation_status: string;
  moderation_notes?: string;
  moderated_at?: string;
  created_at: string;
  company: {
    name: string;
  };
  moderator?: {
    name: string;
  };
}

interface Props {
  jobListings: {
    data: JobListing[];
    current_page: number;
    last_page: number;
  };
  filters: {
    status?: string;
    search?: string;
  };
}

export default function JobListingsModeration({ jobListings, filters }: Props) {
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [moderationModal, setModerationModal] = useState<{
    job: JobListing | null;
    status: string;
    notes: string;
  }>({
    job: null,
    status: 'approved',
    notes: '',
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleFilter = () => {
    router.get(route('admin.moderation.job-listings'), {
      search: search || undefined,
      status: status === 'all' ? undefined : status || undefined,
    });
  };

  const openModerationModal = (job: JobListing) => {
    setModerationModal({
      job,
      status: 'approved',
      notes: '',
    });
  };

  const handleModeration = () => {
    if (!moderationModal.job) return;
    
    router.patch(route('admin.moderation.moderate-job', moderationModal.job.id), {
      status: moderationModal.status,
      notes: moderationModal.notes,
    }, {
      onSuccess: () => {
        setModerationModal({ job: null, status: 'approved', notes: '' });
      },
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedJobs.length === 0) return;
    
    router.post(route('admin.moderation.bulk-moderate-jobs'), {
      job_ids: selectedJobs,
      action,
    }, {
      onSuccess: () => {
        setSelectedJobs([]);
      },
    });
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === jobListings.data.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobListings.data.map(job => job.id));
    }
  };

  return (
    <AppLayout>
      <Head title="Job Listings Moderation" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Listings Moderation</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold">{jobListings.data.length}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {jobListings.data.filter(job => job.moderation_status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {jobListings.data.filter(job => job.moderation_status === 'approved').length}
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
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {jobListings.data.filter(job => job.moderation_status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
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
              <div className="flex-1">
                <Input
                  placeholder="Search by job title or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleFilter} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedJobs.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedJobs.length} jobs selected
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkAction('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Selected
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleBulkAction('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Job Listings</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedJobs.length === jobListings.data.length && jobListings.data.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobListings.data.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobs([...selectedJobs, job.id]);
                          } else {
                            setSelectedJobs(selectedJobs.filter(id => id !== job.id));
                          }
                        }}
                      />
                      <div className="space-y-1">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-600">{job.company.name}</div>
                        <div className="text-xs text-gray-500">
                          Posted: {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        {job.moderated_at && job.moderator && (
                          <div className="text-xs text-gray-500">
                            Moderated by {job.moderator.name} on {new Date(job.moderated_at).toLocaleDateString()}
                          </div>
                        )}
                        {job.moderation_notes && (
                          <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                            <strong>Notes:</strong> {job.moderation_notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(job.moderation_status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModerationModal(job)}
                      >
                        Moderate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {jobListings.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No job listings found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation Modal */}
        {moderationModal.job && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Moderate Job Listing</CardTitle>
                <p className="text-sm text-gray-600">
                  {moderationModal.job.title} by {moderationModal.job.company.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Decision</label>
                  <Select 
                    value={moderationModal.status} 
                    onValueChange={(value) => setModerationModal(prev => ({...prev, status: value}))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={moderationModal.notes}
                    onChange={(e) => setModerationModal(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Add moderation notes..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleModeration} className="flex-1">
                    Submit Decision
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setModerationModal({ job: null, status: 'approved', notes: '' })}
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