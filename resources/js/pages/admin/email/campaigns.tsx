import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus, Send, Eye, Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: string;
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
  creator: {
    name: string;
  };
}

interface Props {
  campaigns: EmailCampaign[];
}

export default function EmailCampaigns({ campaigns }: Props) {
  const getStatusColor = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      draft: 'Konsep',
      scheduled: 'Terjadwal',
      sending: 'Mengirim',
      sent: 'Terkirim',
      cancelled: 'Dibatalkan',
    };
    
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Clock;
      case 'scheduled': return Calendar;
      case 'sending': return Mail;
      case 'sent': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const sendCampaign = (campaign: EmailCampaign) => {
    if (confirm(`Are you sure you want to send "${campaign.name}" to ${campaign.total_recipients} recipients?`)) {
      router.post(route('admin.email.send-campaign', campaign.id));
    }
  };

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return Math.round((campaign.opened_count / campaign.sent_count) * 100);
  };

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.opened_count === 0) return 0;
    return Math.round((campaign.clicked_count / campaign.opened_count) * 100);
  };

  return (
    <AppLayout>
      <Head title="Email Massal" />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Email Massal</h1>
          <Link href={route('admin.email.create-campaign')}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Kirim Email Massal
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Email Massal</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terkirim</p>
                  <p className="text-2xl font-bold text-green-600">
                    {campaigns.filter(c => c.status === 'sent').length}
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
                  <p className="text-sm text-gray-600">Terjadwal</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {campaigns.filter(c => c.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Penerima</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {campaigns.reduce((sum, c) => sum + c.total_recipients, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((campaign) => {
            const StatusIcon = getStatusIcon(campaign.status);
            const openRate = calculateOpenRate(campaign);
            const clickRate = calculateClickRate(campaign);

            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(campaign.status)} flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {getStatusLabel(campaign.status)}
                      </Badge>
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <Button
                          size="sm"
                          onClick={() => sendCampaign(campaign)}
                          className="flex items-center gap-1"
                        >
                          <Send className="h-4 w-4" />
                          Kirim Sekarang
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{campaign.total_recipients}</p>
                        <p className="text-xs text-gray-500">Penerima</p>
                      </div>
                    </div>

                    {campaign.status === 'sent' && (
                      <>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <div>
                            <p className="text-sm font-medium">{campaign.sent_count}</p>
                            <p className="text-xs text-gray-500">Terkirim</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-sm font-medium">{campaign.opened_count} ({openRate}%)</p>
                            <p className="text-xs text-gray-500">Dibuka</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium">{campaign.clicked_count} ({clickRate}%)</p>
                            <p className="text-xs text-gray-500">Diklik</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      <p>Dibuat oleh {campaign.creator.name}</p>
                      <p>
                        {campaign.status === 'sent' && campaign.sent_at 
                          ? `Terkirim: ${new Date(campaign.sent_at).toLocaleString()}`
                          : campaign.scheduled_at 
                          ? `Terjadwal: ${new Date(campaign.scheduled_at).toLocaleString()}`
                          : `Dibuat: ${new Date(campaign.created_at).toLocaleString()}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar for sending campaigns */}
                  {campaign.status === 'sending' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sending Progress</span>
                        <span>{campaign.sent_count} / {campaign.total_recipients}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${(campaign.sent_count / campaign.total_recipients) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {campaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak ada kampanye email ditemukan</h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan membuat kampanye email pertama Anda.
              </p>
              <Link href={route('admin.email.create-campaign')}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Kampanye
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}