<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class Locale
{
    public function handle($request, Closure $next)
    {
        $locale = 'en';
         $available = config('app.available_languages', ['en', 'ar']);

        if ($locale && in_array($locale, $available)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
