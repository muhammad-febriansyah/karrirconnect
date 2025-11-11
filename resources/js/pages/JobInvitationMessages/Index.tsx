import React, { useState, useRef, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import axios from '@/lib/axios';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Paperclip, Send, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import MainLayout from '@/layouts/main-layout';

interface Attachment {
    name: string;
    path: string;
    size: number;
    type: string;
}

interface Message {
    id: number;
    job_invitation_id: number;
    sender_id: number;
    message: string;
    attachments: Attachment[] | null;
    read_at: string | null;
    created_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
    };
}

interface JobInvitation {
    id: number;
    status: string;
    message: string;
    created_at: string;
    company: {
        id: number;
        name: string;
        logo: string | null;
    };
    job_listing: {
        id: number;
        title: string;
        slug: string;
    };
    candidate: {
        id: number;
        name: string;
        email: string;
    };
    sender: {
        id: number;
        name: string;
        email: string;
    };
}

interface PageProps {
    jobInvitation: JobInvitation;
    messages: Message[];
}

export default function Index() {
    const { props } = usePage<PageProps>();
    const { jobInvitation, messages: initialMessages } = props;


    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const auth = usePage().props.auth as any;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-scroll when component mounts
    useEffect(() => {
        setTimeout(() => scrollToBottom(), 100);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // Check file size (10MB max per file)
            const maxSize = 10 * 1024 * 1024;
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                    toast.error(`File ${files[i].name} is too large. Maximum size is 10MB.`);
                    return;
                }
            }
            setSelectedFiles(files);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() && (!selectedFiles || selectedFiles.length === 0)) {
            return;
        }

        setIsSending(true);

        const formData = new FormData();
        formData.append('message', newMessage);

        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('attachments[]', selectedFiles[i]);
            }
        }

        try {
            const isCompany = auth?.user?.role === 'company_admin';
            const postUrl = isCompany
                ? route('company.job-invitations.messages.store', jobInvitation.id)
                : route('user.job-invitations.messages.store', jobInvitation.id);

            // Use axios which automatically handles CSRF token from meta tag
            const response = await axios.post(postUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.message) {
                setMessages(prev => [...prev, response.data.message]);
                setNewMessage('');
                setSelectedFiles(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                toast.success('Pesan berhasil dikirim');
            }
        } catch (error: any) {
            console.error('Error sending message:', error);

            if (error.response?.status === 419) {
                toast.error('Session Anda telah berakhir. Silakan refresh halaman dan login kembali.');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Gagal mengirim pesan. Silakan coba lagi.');
            }
        } finally {
            setIsSending(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <MainLayout currentPage="job-invitations">
            <Head title={`Pesan - ${jobInvitation.job_listing?.title || 'Chat'}`} />

                <main className="pt-20 pb-12">
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            // Smart back navigation based on user role
                            if (auth?.user?.role === 'company_admin') {
                                router.visit(route('company.job-invitations.index'));
                            } else {
                                router.visit(route('user.job-invitations.index'));
                            }
                        }}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Job Invitations
                    </Button>

                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={jobInvitation?.company?.logo ? `/storage/${jobInvitation.company.logo}` : undefined} />
                                        <AvatarFallback>
                                            {jobInvitation?.company?.name?.charAt(0) || 'C'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {jobInvitation?.job_listing?.title || 'Chat'}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            {jobInvitation?.company?.name || 'Company'}
                                        </p>
                                        <p className={`text-xs mt-1 font-medium ${
                                            auth?.user?.role === 'company_admin'
                                                ? 'text-green-600'
                                                : 'text-blue-600'
                                        }`}>
                                            {auth?.user?.role === 'company_admin'
                                                ? 'Anda chatting sebagai Perusahaan'
                                                : 'Anda chatting sebagai Kandidat'}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(jobInvitation.status)}>
                                    {jobInvitation.status === 'pending' && 'Menunggu'}
                                    {jobInvitation.status === 'accepted' && 'Diterima'}
                                    {jobInvitation.status === 'declined' && 'Ditolak'}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Messages */}
                <Card className="mb-4" style={{ height: '500px' }}>
                    <CardContent className="p-0 h-full">
                        <div className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {(messages && Array.isArray(messages) ? messages : []).map((message) => {
                                const senderId = (message as any).sender?.id ?? (message as any).sender_id;
                                const isOwnMessage = Number(senderId) === Number(auth?.user?.id);

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                                isOwnMessage
                                                    ? auth?.user?.role === 'company_admin'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                    : auth?.user?.role === 'company_admin'
                                                        ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                                            }`}
                                        >
                                            <div className="text-sm font-medium mb-1 flex items-center gap-2">
                                                {message?.sender?.name || 'Unknown'}
                                                {/* Role badge for sender identification */}
                                                {senderId !== auth?.user?.id && (
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        // If current user is company_admin, other person is user (candidate)
                                                        auth?.user?.role === 'company_admin'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {auth?.user?.role === 'company_admin' ? 'Kandidat' : 'Perusahaan'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                {message.message}
                                            </div>

                                            {/* Attachments */}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {message.attachments.map((attachment, index) => (
                                                        <div key={index} className="flex items-center space-x-2 text-xs">
                                                            <Paperclip className="h-3 w-3" />
                                                            <a
                                                                href={(auth?.user?.role === 'company_admin')
                                                                    ? route('company.job-invitations.messages.download', [message.id, index])
                                                                    : route('user.job-invitations.messages.download', [message.id, index])}
                                                                className="underline hover:no-underline"
                                                                target="_blank"
                                                            >
                                                                {attachment.name} ({formatFileSize(attachment.size)})
                                                            </a>
                                                            <Download className="h-3 w-3" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-xs mt-1 opacity-75">
                                                {formatMessageTime(message.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </CardContent>
                </Card>

                {/* Message Input */}
                <Card className={`sticky bottom-4 shadow-lg border-t-2 ${
                    auth?.user?.role === 'company_admin'
                        ? 'border-green-100 bg-green-50/50'
                        : 'border-blue-100 bg-blue-50/50'
                }`}>
                    <CardContent className="p-6">
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            {/* File Attachments Preview */}
                            {selectedFiles && selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">File terpilih:</div>
                                    {Array.from(selectedFiles).map((file, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded">
                                            <Paperclip className="h-4 w-4" />
                                            <span>{file.name} ({formatFileSize(file.size)})</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <Input
                                    type="text"
                                    placeholder="Ketik pesan..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 rounded-full px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                />
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-4"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSending || (!newMessage.trim() && (!selectedFiles || selectedFiles.length === 0))}
                                    size="lg"
                                    className={`rounded-full px-6 ${
                                        auth?.user?.role === 'company_admin'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                    </div>
                </main>
        </MainLayout>
    );
}