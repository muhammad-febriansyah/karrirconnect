<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhatsappTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class WhatsAppTemplateController extends Controller
{
    public function index()
    {
        $templates = WhatsappTemplate::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/whatsapp/templates', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/whatsapp/create-template');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:notification,marketing,system,alert',
            'variables' => 'nullable|array',
            'description' => 'nullable|string',
            'use_emoji' => 'boolean',
            'include_timestamp' => 'boolean',
            'include_signature' => 'boolean',
            'signature_text' => 'nullable|string|max:255',
        ]);

        WhatsappTemplate::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'variables' => $request->variables ?? [],
            'description' => $request->description,
            'use_emoji' => $request->use_emoji ?? true,
            'include_timestamp' => $request->include_timestamp ?? true,
            'include_signature' => $request->include_signature ?? true,
            'signature_text' => $request->signature_text ?? '_Pesan otomatis dari KarirConnect_',
        ]);

        return redirect()->route('admin.whatsapp.templates.index')->with('success', 'Template WhatsApp berhasil dibuat.');
    }

    public function show(WhatsappTemplate $template)
    {
        return Inertia::render('admin/whatsapp/show-template', [
            'template' => $template,
        ]);
    }

    public function edit(WhatsappTemplate $template)
    {
        return Inertia::render('admin/whatsapp/edit-template', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, WhatsappTemplate $template)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:notification,marketing,system,alert',
            'variables' => 'nullable|array',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'use_emoji' => 'boolean',
            'include_timestamp' => 'boolean',
            'include_signature' => 'boolean',
            'signature_text' => 'nullable|string|max:255',
        ]);

        $template->update([
            'name' => $request->name,
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'variables' => $request->variables ?? [],
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'use_emoji' => $request->use_emoji ?? true,
            'include_timestamp' => $request->include_timestamp ?? true,
            'include_signature' => $request->include_signature ?? true,
            'signature_text' => $request->signature_text ?? '_Pesan otomatis dari KarirConnect_',
        ]);

        return redirect()->route('admin.whatsapp.templates.index')->with('success', 'Template WhatsApp berhasil diperbarui.');
    }

    public function destroy(WhatsappTemplate $template)
    {
        $template->delete();

        return back()->with('success', 'Template WhatsApp berhasil dihapus.');
    }

    public function toggleStatus(WhatsappTemplate $template)
    {
        $template->update(['is_active' => !$template->is_active]);

        $status = $template->is_active ? 'activated' : 'deactivated';
        $statusText = $template->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Template WhatsApp berhasil {$statusText}.");
    }

    public function preview(Request $request, WhatsappTemplate $template)
    {
        $request->validate([
            'data' => 'nullable|array',
        ]);

        $previewData = $request->data ?? [];
        
        // Add sample data if variables exist but no data provided
        if (!empty($template->variables) && empty($previewData)) {
            foreach ($template->variables as $variable) {
                $previewData[$variable] = match($variable) {
                    'user_name' => 'John Doe',
                    'company_name' => 'PT Contoh Perusahaan',
                    'job_title' => 'Frontend Developer',
                    'application_date' => now()->format('d/m/Y'),
                    'version' => '2.1.0',
                    default => '[Sample ' . ucfirst(str_replace('_', ' ', $variable)) . ']'
                };
            }
        }

        $renderedMessage = $template->render($previewData);

        return response()->json([
            'preview' => $renderedMessage,
            'sample_data' => $previewData,
        ]);
    }

    public function testSend(Request $request, WhatsappTemplate $template)
    {
        $request->validate([
            'phone_number' => 'required|string',
            'data' => 'nullable|array',
        ]);

        try {
            $controller = new \App\Http\Controllers\WaGatewayController();
            $message = $template->render($request->data ?? []);
            
            $controller->sendWhatsAppMessage($request->phone_number, $message);

            return response()->json([
                'success' => true,
                'message' => 'Test WhatsApp berhasil dikirim ke ' . $request->phone_number,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim test WhatsApp: ' . $e->getMessage(),
            ], 500);
        }
    }
}
