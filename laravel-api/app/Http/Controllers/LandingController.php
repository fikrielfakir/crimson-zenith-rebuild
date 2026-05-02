<?php

namespace App\Http\Controllers;

use App\Models\FocusItem;
use App\Models\TeamMember;
use App\Models\LandingTestimonial;
use App\Models\SiteStat;
use App\Models\Partner;
use App\Models\HeroSettings;
use App\Models\NavbarSettings;
use App\Models\PresidentMessageSettings;

class LandingController extends Controller
{
    public function index()
    {
        return response()->json([
            'hero'             => HeroSettings::firstOrCreate(['id' => 'default']),
            'navbar'           => NavbarSettings::firstOrCreate(['id' => 'default']),
            'presidentMessage' => PresidentMessageSettings::firstOrCreate(['id' => 'default']),
            'focusItems'       => FocusItem::where('is_active', true)->orderBy('ordering')->get(),
            'teamMembers'      => TeamMember::where('is_active', true)->orderBy('ordering')->get(),
            'testimonials'     => LandingTestimonial::where('is_active', true)->where('is_approved', true)->orderBy('ordering')->get(),
            'stats'            => SiteStat::where('is_active', true)->orderBy('ordering')->get(),
            'partners'         => Partner::where('is_active', true)->orderBy('ordering')->get(),
        ]);
    }
}
