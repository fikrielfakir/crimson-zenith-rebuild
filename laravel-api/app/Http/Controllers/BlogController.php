<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::where('status', 'published');
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->has('search'))   $query->where('title', 'like', '%'.$request->search.'%');
        return response()->json($query->orderBy('published_at', 'desc')->with('author')->get());
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)->where('status', 'published')->with('author')->firstOrFail();
        $post->increment('views');
        return response()->json($post);
    }
}
