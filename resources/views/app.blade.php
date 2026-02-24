<!DOCTYPE html>
<html class="h-full bg-white">
{{-- <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @vite(['resources/css/app.css', 'resources/js/manifest.js', 'resources/js/vendor.js', 'resources/js/app.js'])
    @routes
</head> --}}
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
     @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @routes
    @inertiaHead
</head>

<body class="font-sans antialiased leading-none text-black bg-white">

@inertia

</body>
</html>
