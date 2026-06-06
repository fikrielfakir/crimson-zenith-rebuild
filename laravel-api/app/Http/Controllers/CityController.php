<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::where('is_active', true)
            ->orderBy('ordering')
            ->orderBy('id')
            ->get();

        return response()->json($cities);
    }

    public function show($slug)
    {
        $city = City::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json($city);
    }
}
