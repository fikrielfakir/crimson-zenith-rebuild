<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::with('author');
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('search')) $query->where('title', 'like', '%'.$request->search.'%');
        $page  = max(1, (int)($request->page ?? 1));
        $limit = max(1, min(100, (int)($request->limit ?? 20)));
        $total = $query->count();
        $posts = $query->orderBy('created_at', 'desc')->skip(($page-1)*$limit)->take($limit)->get();
        return response()->json(['posts' => $posts, 'total' => $total, 'page' => $page, 'limit' => $limit]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string',
            'content'  => 'required|string',
            'excerpt'  => 'nullable|string',
            'category' => 'nullable|string',
            'status'   => 'nullable|in:draft,published',
            'tags'     => 'nullable|array',
        ]);
        $data['slug']        = Str::slug($data['title']).'-'.Str::random(5);
        $data['author_id']   = $request->user()->id;
        $data['status']      = $data['status'] ?? 'draft';
        $data['tags']        = $data['tags'] ?? [];
        if ($data['status'] === 'published') $data['published_at'] = now();
        $post = BlogPost::create($data);
        return response()->json($post->load('author'), 201);
    }

    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);
        $data = $request->except(['id', 'author_id', 'created_at']);
        if (isset($data['title'])) $data['slug'] = Str::slug($data['title']).'-'.Str::random(5);
        if (isset($data['status']) && $data['status'] === 'published' && !$post->published_at) {
            $data['published_at'] = now();
        }
        $post->update($data);
        return response()->json($post->fresh()->load('author'));
    }

    public function destroy($id)
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}
