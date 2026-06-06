<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    // ------------------------------------------------------------------ //
    // Helpers
    // ------------------------------------------------------------------ //

    private function mapOutput(BlogPost $p): array
    {
        $author = $p->relationLoaded('author') ? $p->author : null;

        return [
            'id'            => $p->id,
            'title'         => $p->title,
            'slug'          => $p->slug,
            'content'       => $p->content,
            'excerpt'       => $p->excerpt,
            'category'      => $p->category,
            'tags'          => $p->tags ?? [],
            'featuredImage' => $p->featured_image,
            'status'        => $p->status,
            'views'         => $p->views ?? 0,
            'authorId'      => $p->author_id,
            'authorName'    => $author ? trim(($author->first_name ?? '') . ' ' . ($author->last_name ?? '')) : null,
            'publishedAt'   => $p->published_at?->toISOString(),
            'createdAt'     => $p->created_at?->toISOString(),
            'updatedAt'     => $p->updated_at?->toISOString(),
        ];
    }

    private function mapInput(Request $r): array
    {
        $data = array_filter([
            'title'          => $r->input('title'),
            'content'        => $r->input('content'),
            'excerpt'        => $r->input('excerpt'),
            'category'       => $r->input('category'),
            'tags'           => $r->input('tags', []),
            'featured_image' => $r->input('featuredImage'),
            'status'         => $r->input('status', 'draft'),
        ], fn($v) => $v !== null);

        return $data;
    }

    // ------------------------------------------------------------------ //
    // CRUD
    // ------------------------------------------------------------------ //

    public function index(Request $request)
    {
        $query = BlogPost::with('author');

        if ($request->filled('status'))   $query->where('status', $request->status);
        if ($request->filled('category')) $query->where('category', $request->category);
        if ($request->filled('search'))   $query->where('title', 'like', '%' . $request->search . '%');

        $page    = max(1, (int) ($request->page    ?? 1));
        $perPage = max(1, min(100, (int) ($request->perPage ?? $request->limit ?? 25)));
        $total   = $query->count();

        $posts = $query->orderBy('created_at', 'desc')
                       ->skip(($page - 1) * $perPage)
                       ->take($perPage)
                       ->get()
                       ->map(fn($p) => $this->mapOutput($p));

        return response()->json([
            'posts'   => $posts,
            'total'   => $total,
            'page'    => $page,
            'perPage' => $perPage,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required|string|max:255',
            'content'       => 'required|string',
            'excerpt'       => 'nullable|string',
            'category'      => 'nullable|string|max:100',
            'featuredImage' => 'nullable|string',
            'status'        => 'nullable|in:draft,published',
            'tags'          => 'nullable|array',
        ]);

        $data                = $this->mapInput($request);
        $data['slug']        = Str::slug($request->input('title')) . '-' . Str::random(5);
        $data['author_id']   = $request->user()?->id;
        $data['tags']        = $data['tags'] ?? [];
        $data['status']      = $data['status'] ?? 'draft';

        if ($data['status'] === 'published') {
            $data['published_at'] = now();
        }

        $post = BlogPost::create($data);

        return response()->json($this->mapOutput($post->fresh()->load('author')), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'         => 'sometimes|string|max:255',
            'featuredImage' => 'nullable|string',
            'status'        => 'nullable|in:draft,published',
            'tags'          => 'nullable|array',
        ]);

        $post = BlogPost::findOrFail($id);
        $data = $this->mapInput($request);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }

        if (isset($data['status']) && $data['status'] === 'published' && !$post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);

        return response()->json($this->mapOutput($post->fresh()->load('author')));
    }

    public function destroy($id)
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}
