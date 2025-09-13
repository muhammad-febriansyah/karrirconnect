@php
    $setting = \App\Models\Setting::first();
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">


    <style>
        html {
            background-color: oklch(1 0 0);
        }
    </style>

    <title>{{ $setting->site_name }}</title>

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('storage/' . $setting->logo) }}" sizes="any">
    <link rel="icon" href="{{ asset('storage/' . $setting->logo) }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('storage/' . $setting->logo) }}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $setting->site_name }} - Platform Karir Terdepan Indonesia">
    <meta property="og:description" content="{{ $setting->description ?? 'Temukan pekerjaan impian Anda atau cari talenta terbaik di ' . $setting->site_name . '. Platform karir terpercaya dengan ribuan lowongan dari perusahaan terbaik di Indonesia.' }}">
    <meta property="og:image" content="{{ $setting->thumbnail ? asset('storage/' . $setting->thumbnail) : ($setting->logo ? asset('storage/' . $setting->logo) : asset('images/default-og.jpg')) }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="{{ $setting->site_name }}">
    <meta property="og:locale" content="id_ID">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="{{ $setting->site_name }} - Platform Karir Terdepan">
    <meta property="twitter:description" content="{{ $setting->description ?? 'Temukan pekerjaan impian Anda atau cari talenta terbaik di ' . $setting->site_name . '. Platform karir terpercaya dengan ribuan lowongan dari perusahaan terbaik.' }}">
    <meta property="twitter:image" content="{{ $setting->thumbnail ? asset('storage/' . $setting->thumbnail) : asset('storage/' . $setting->logo) }}">
    
    <!-- Additional Meta Tags -->
    <meta name="description" content="{{ $setting->description ?? 'Temukan pekerjaan impian Anda atau cari talenta terbaik di ' . $setting->site_name . '. Platform karir terpercaya dengan ribuan lowongan dari perusahaan terbaik.' }}">
    <meta name="keywords" content="{{ $setting->keyword ?? 'lowongan kerja, karir, pekerjaan, rekrutmen, ' . $setting->site_name }}">
    <meta name="author" content="{{ $setting->site_name }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
    
    <!-- Midtrans Snap Script -->
    @if(config('services.midtrans.is_production'))
        <script src="https://app.midtrans.com/snap/snap.js" data-client-key="{{ config('services.midtrans.client_key') }}"></script>
    @else
        <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="{{ config('services.midtrans.client_key') }}"></script>
    @endif
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
