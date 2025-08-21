import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, User, Calendar, MapPin, Monitor, Search, Download } from 'lucide-react';

interface ActivityLog {
  id: number;
  action: string;
  description: string;
  entity_type?: string;
  entity_id?: number;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

interface UserOption {
  id: number;
  name: string;
  email: string;
}

interface Props {
  logs: {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    user_id?: number;
    action?: string;
    date_from?: string;
    date_to?: string;
  };
  users: UserOption[];
}

export default function ActivityLogs({ logs, filters, users }: Props) {
  const [userId, setUserId] = useState(filters.user_id?.toString() || 'all');
  const [action, setAction] = useState(filters.action || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

  const getActionColor = (action: string) => {
    const actionColors = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-blue-100 text-blue-800',
      'create': 'bg-green-100 text-green-800',
      'update': 'bg-yellow-100 text-yellow-800',
      'delete': 'bg-red-100 text-red-800',
      'export': 'bg-purple-100 text-purple-800',
      'bulk_action': 'bg-orange-100 text-orange-800',
      'verification': 'bg-blue-100 text-blue-800',
    };
    
    for (const [key, color] of Object.entries(actionColors)) {
      if (action.toLowerCase().includes(key)) {
        return color;
      }
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const handleFilter = () => {
    router.get('/admin/users/activity-logs', {
      user_id: userId !== 'all' ? userId : undefined,
      action: action || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  };

  const clearFilters = () => {
    setUserId('all');
    setAction('');
    setDateFrom('');
    setDateTo('');
    router.get(route('admin.users.activity-logs'));
  };

  const formatUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Other';
  };

  const exportLogs = () => {
    const queryParams = new URLSearchParams({
      user_id: userId || '',
      action: action || '',
      date_from: dateFrom || '',
      date_to: dateTo || '',
      export: 'csv'
    });
    
    window.open(`/admin/users/activity-logs?${queryParams.toString()}`, '_blank');
  };

  return (
    <AppLayout>
      <Head title="Activity Logs" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Activity Logs</h1>
          <Button onClick={exportLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold">{logs.total}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {logs.data.filter(log => {
                      const today = new Date().toDateString();
                      const logDate = new Date(log.created_at).toDateString();
                      return today === logDate;
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(logs.data.map(log => log.user.email)).size}
                  </p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Actions</p>
                  <p className="text-2xl font-bold text-red-600">
                    {logs.data.filter(log => 
                      log.action.toLowerCase().includes('delete') || 
                      log.action.toLowerCase().includes('bulk')
                    ).length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter by action..."
                value={action}
                onChange={(e) => setAction(e.target.value)}
              />

              <Input
                type="date"
                placeholder="From Date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />

              <Input
                type="date"
                placeholder="To Date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />

              <div className="flex gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  <Search className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.data.map((log) => (
                <div key={log.id} className="border-l-4 border-blue-200 pl-4 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{log.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {log.user.name} ({log.user.email})
                          </div>
                          
                          {log.ip_address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {log.ip_address}
                            </div>
                          )}
                          
                          {log.user_agent && (
                            <div className="flex items-center gap-1">
                              <Monitor className="h-4 w-4" />
                              {formatUserAgent(log.user_agent)}
                            </div>
                          )}
                        </div>

                        {log.entity_type && (
                          <div className="text-xs text-gray-500">
                            <strong>Entity:</strong> {log.entity_type}
                            {log.entity_id && ` (ID: ${log.entity_id})`}
                          </div>
                        )}

                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {logs.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No activity logs found</h3>
                <p>
                  {Object.values(filters).some((f) => f)
                    ? 'Try adjusting your filters to see more results.'
                    : 'Activity logs will appear here as users interact with the system.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {logs.last_page > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing page {logs.current_page} of {logs.last_page}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={logs.current_page === 1}
                    onClick={() =>
                      router.get('/admin/users/activity-logs', {
                        ...filters,
                        page: logs.current_page - 1,
                      })
                    }
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {logs.current_page} of {logs.last_page}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={logs.current_page === logs.last_page}
                    onClick={() =>
                      router.get('/admin/users/activity-logs', {
                        ...filters,
                        page: logs.current_page + 1,
                      })
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}