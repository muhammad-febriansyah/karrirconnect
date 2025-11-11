import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail } from 'lucide-react';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject: string;
    body: string;
    variables: string[] | null;
    type: 'system' | 'marketing' | 'transactional';
    is_active: boolean;
}

interface PreviewData {
    subject: string;
    body: string;
}

interface Props {
    template: EmailTemplate;
    preview: PreviewData;
}

const typeConfig: Record<EmailTemplate['type'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    system: { label: 'System', variant: 'default' },
    marketing: { label: 'Marketing', variant: 'secondary' },
    transactional: { label: 'Transactional', variant: 'outline' },
};

export default function Preview({ template, preview }: Props) {
    const config = typeConfig[template.type] ?? typeConfig.system;

    return (
        <AppLayout>
            <Head title={`Preview ${template.name}`} />

            <div className="mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-4 sm:space-y-8 sm:px-6 lg:space-y-10 lg:px-0 lg:pb-12">
                <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/30 p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
                    <div className="space-y-4">
                        <Button variant="ghost" size="sm" asChild className="w-full sm:w-fit">
                            <Link href={`/admin/email-templates/${template.id}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to template
                            </Link>
                        </Button>
                        <div className="flex items-start gap-3">
                            <Mail className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                                    Preview &mdash; {template.name}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">{template.slug}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={config.variant} className="rounded-full px-3 py-1 capitalize">
                            {config.label}
                        </Badge>
                        <Badge variant={template.is_active ? 'default' : 'secondary'} className="rounded-full px-3 py-1 capitalize">
                            {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_2fr]">
                    <Card className="h-full border-border/60 shadow-sm">
                        <CardHeader className="space-y-1.5">
                            <CardTitle className="text-lg">Template Info</CardTitle>
                            <CardDescription className="text-sm">Detail variabel dan meta template</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-4 sm:p-6">
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Subject</p>
                                <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground">
                                    {preview.subject}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Variables</p>
                                {template.variables?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {template.variables.map((variable) => (
                                            <Badge key={variable} variant="outline" className="font-mono text-xs">
                                                {'{{'}
                                                {variable}
                                                {'}}'}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada variabel khusus</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Actions</p>
                                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                                    <Link href={`/admin/email-templates/${template.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Template
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="space-y-1.5">
                            <CardTitle className="text-lg">Email Preview</CardTitle>
                            <CardDescription className="text-sm">
                                Tampilan email setelah variabel digantikan sample data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6">
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-xs font-medium uppercase text-muted-foreground">Subject</p>
                                <p className="text-base font-semibold text-foreground">{preview.subject}</p>
                            </div>
                            <div className="max-h-[70vh] overflow-auto rounded-lg border bg-white p-4 shadow-inner">
                                <div
                                    className="prose max-w-none text-sm sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: preview.body }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
