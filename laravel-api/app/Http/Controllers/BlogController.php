<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    private function formatPost(BlogPost $post): array
    {
        $author = $post->relationLoaded('author') ? $post->author : null;
        $authorName = $author
            ? trim(($author->first_name ?? '') . ' ' . ($author->last_name ?? ''))
            : 'The Journey Team';

        return [
            'id'           => $post->id,
            'title'        => $post->title,
            'slug'         => $post->slug,
            'excerpt'      => $post->excerpt,
            'content'      => $post->content,
            'category'     => $post->category,
            'tags'         => $post->tags ?? [],
            'image_url'    => $post->featured_image,
            'featured_image' => $post->featured_image,
            'status'       => $post->status,
            'views'        => $post->views ?? 0,
            'published_at' => $post->published_at?->toISOString(),
            'created_at'   => $post->created_at?->toISOString(),
            'author_name'  => $authorName,
            'author'       => $author ? [
                'name'   => $authorName,
                'avatar' => $author->profile_image_url,
                'bio'    => $author->bio,
            ] : null,
        ];
    }

    public function index(Request $request)
    {
        $query = BlogPost::where('status', 'published');
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->has('search'))   $query->where('title', 'like', '%'.$request->search.'%');
        $posts = $query->orderBy('published_at', 'desc')->with('author')->get()
                       ->map(fn($p) => $this->formatPost($p));
        return response()->json($posts);
    }

    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)->where('status', 'published')->with('author')->firstOrFail();
        $post->increment('views');
        return response()->json($this->formatPost($post->fresh()->load('author')));
    }
}
