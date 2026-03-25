<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class Locale
{
    public function handle($request, Closure $next)
    {

        $locale = $request->header('X-App-Locale');
 
          $available = config('app.available_languages', ['en', 'ar']);
          logger($locale);

        if ($locale && in_array($locale, $available)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
