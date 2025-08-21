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
import { Search, ShieldCheck, ShieldX, Clock, User, Mail, Phone, MapPin } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  verification_status: string;
  verification_notes?: string;
  verified_at?: string;
  created_at: string;
  verifier?: {
    name: string;
  };
  user_profile?: {
    phone?: string;
    location?: string;
    bio?: string;
  };
}

interface Props {
  users: {
    data: UserData[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    status?: string;
    search?: string;
  };
}

export default function UserVerification({ users, filters }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [verificationModal, setVerificationModal] = useState<{
    user: UserData | null;
    status: string;
    notes: string;
  }>({
    user: null,
    status: 'verified',
    notes: '',
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unverified: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      verified: { color: 'bg-green-100 text-green-800', icon: ShieldCheck },
      rejected: { color: 'bg-red-100 text-red-800', icon: ShieldX },
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
    router.get('/admin/users/verification', {
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
    });
  };

  const openVerificationModal = (user: UserData) => {
    setVerificationModal({
      user,
      status: 'verified',
      notes: '',
    });
  };

  const handleVerification = () => {
    if (!verificationModal.user) return;
    
    router.patch(`/admin/users/${verificationModal.user.id}/verification`, {
      status: verificationModal.status,
      notes: verificationModal.notes,
    }, {
      onSuccess: () => {
        setVerificationModal({ user: null, status: 'verified', notes: '' });
      },
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    
    router.post('/admin/users/bulk-actions', {
      action,
      user_ids: selectedUsers,
      notes: action === 'verify' || action === 'reject' ? `Bulk ${action} action` : undefined,
    }, {
      onSuccess: () => {
        setSelectedUsers([]);
      },
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.data.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.data.map(user => user.id));
    }
  };

  return (
    <AppLayout>
      <Head title="User Verification" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Verification</h1>
          <Button onClick={() => router.get('/admin/users/export')}>
            Export Users
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{users.total}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {users.data.filter(user => user.verification_status === 'pending').length}
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
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.data.filter(user => user.verification_status === 'verified').length}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.data.filter(user => user.verification_status === 'rejected').length}
                  </p>
                </div>
                <ShieldX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or email..."
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
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
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

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} users selected
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkAction('verify')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify Selected
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleBulkAction('reject')}
                  >
                    <ShieldX className="h-4 w-4 mr-2" />
                    Reject Selected
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('activate')}
                  >
                    Activate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('deactivate')}
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Users</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedUsers.length === users.data.length && users.data.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.data.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{user.name}</div>
                          {getStatusBadge(user.verification_status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          {user.user_profile?.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.user_profile.phone}
                            </div>
                          )}
                          {user.user_profile?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {user.user_profile.location}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Registered: {new Date(user.created_at).toLocaleDateString()}
                          {user.verified_at && user.verifier && (
                            <span className="ml-4">
                              Verified by {user.verifier.name} on {new Date(user.verified_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {user.verification_notes && (
                          <div className="text-xs bg-gray-100 p-2 rounded">
                            <strong>Notes:</strong> {user.verification_notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openVerificationModal(user)}
                    >
                      {user.verification_status === 'pending' ? 'Review' : 'Update'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {users.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Modal */}
        {verificationModal.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Verify User</CardTitle>
                <p className="text-sm text-gray-600">
                  {verificationModal.user.name} - {verificationModal.user.email}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Decision</label>
                  <Select 
                    value={verificationModal.status} 
                    onValueChange={(value) => setVerificationModal(prev => ({...prev, status: value}))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verify</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={verificationModal.notes}
                    onChange={(e) => setVerificationModal(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Add verification notes..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleVerification} className="flex-1">
                    Submit Decision
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setVerificationModal({ user: null, status: 'verified', notes: '' })}
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