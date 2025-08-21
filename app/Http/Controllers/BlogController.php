<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = News::with(['author'])
            ->published();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Tag filter
        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $posts = $query->orderBy('is_featured', 'desc')
                      ->orderBy('published_at', 'desc')
                      ->paginate(6)
                      ->withQueryString();

        // Featured posts
        $featuredPosts = News::with(['author'])
            ->published()
            ->where('is_featured', true)
            ->orderBy('published_at', 'desc')
            ->limit(4)
            ->get();

        // Get available categories
        $categories = News::published()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
        
        // Popular tags - get from existing news tags
        $popularTags = News::published()
            ->whereNotNull('tags')
            ->get()
            ->pluck('tags')
            ->flatten()
            ->unique()
            ->take(10)
            ->values()
            ->toArray();

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'categories' => $categories,
            'popularTags' => $popularTags,
            'filters' => $request->only(['search', 'category', 'tag'])
        ]);
    }

    public function show($id)
    {
        // Find by ID or slug
        $post = News::where('id', $id)
                   ->orWhere('slug', $id)
                   ->published()
                   ->with(['author'])
                   ->firstOrFail();
        
        // Increment view count
        $post->increment('views_count');

        // Related posts
        $relatedPosts = News::with(['author'])
            ->published()
            ->where('id', '!=', $post->id)
            ->where(function($query) use ($post) {
                if ($post->category) {
                    $query->where('category', $post->category);
                }
                if ($post->tags && is_array($post->tags)) {
                    foreach ($post->tags as $tag) {
                        $query->orWhereJsonContains('tags', $tag);
                    }
                }
            })
            ->orderBy('published_at', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts
        ]);
    }
}