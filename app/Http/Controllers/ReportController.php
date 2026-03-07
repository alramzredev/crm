<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ReportController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Reports/Index');
    }
}
