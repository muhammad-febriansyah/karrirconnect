import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { 
    ArrowLeft, 
    ArrowRight, 
    BookOpen, 
    Calendar, 
    Clock, 
    Eye, 
    Share2, 
    User,
    Facebook,
    Twitter,
    Linkedin,
    MessageCircle,
    ChevronRight,
    Tag
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
    };
    category: string;
    tags: string[] | null;
    featured_image?: string;
    published_at: string;
    reading_time: number;
    views_count: number;
    comments_count: number;
    is_featured: boolean;
}

interface BlogShowProps {
    post: BlogPost;
    relatedPosts: BlogPost[];
}

export default function BlogShow({ post, relatedPosts }: BlogShowProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatReadingTime = (minutes: number) => {
        return `${minutes} menit baca`;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(post.title);
    const shareText = encodeURIComponent(post.excerpt);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
    };

    return (
        <>
            <Head title={`${post.title} - Blog KarirConnect`} />
            
            <div className="min-h-screen bg-white">
                <ModernNavbar currentPage="blog" />

                {/* Hero Section */}
                <section className="relative bg-white pt-32 pb-8 lg:pt-40 lg:pb-12 overflow-hidden">
                    {/* Flickering Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(34, 197, 94)"
                            maxOpacity={0.08}
                            flickerChance={0.1}
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Breadcrumb */}
                        <motion.nav 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
                        >
                            <Link href="/" className="hover:text-[#2347FA] transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/blog" className="hover:text-[#2347FA] transition-colors">Blog</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900 font-medium">{post.category}</span>
                        </motion.nav>

                        {/* Back to Blog */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mb-8"
                        >
                            <Link href="/blog">
                                <Button variant="outline" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white">
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Kembali ke Blog
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Article Header */}
                        <div className="text-center mb-12">
                            {/* Category & Featured Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex justify-center items-center gap-4 mb-6"
                            >
                                <Badge className="bg-[#2347FA] text-white px-4 py-2 rounded-full font-semibold">
                                    {post.category}
                                </Badge>
                                {post.is_featured && (
                                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 rounded-full font-semibold">
                                        ⭐ Featured
                                    </Badge>
                                )}
                            </motion.div>
                            
                            {/* Title */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                {post.title}
                            </motion.h1>
                            
                            {/* Excerpt */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
                            >
                                {post.excerpt}
                            </motion.p>

                            {/* Meta Information */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-600"
                            >
                                {/* Author */}
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                                        <AvatarImage
                                            src={post.author.avatar ? `/storage/${post.author.avatar}` : undefined}
                                            alt={post.author.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-blue-600 text-white font-bold text-lg">
                                            {post.author.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                                        <p className="text-gray-500">Author</p>
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="h-12 hidden md:block" />

                                {/* Date & Reading Time */}
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-[#2347FA]" />
                                        <span className="font-medium">{formatDate(post.published_at)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-[#2347FA]" />
                                        <span className="font-medium">{formatReadingTime(post.reading_time)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4 text-[#2347FA]" />
                                        <span className="font-medium">{post.views_count} views</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Featured Image */}
                            {post.featured_image ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative h-64 md:h-96 overflow-hidden"
                                >
                                    <img
                                        src={`/storage/${post.featured_image}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative h-64 md:h-96 bg-gradient-to-br from-[#2347FA]/10 via-blue-100 to-indigo-100 flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#2347FA]/5 to-blue-500/5" />
                                    <BookOpen className="h-24 w-24 text-[#2347FA]/60 relative z-10" />
                                </motion.div>
                            )}

                            {/* Content Body */}
                            <div className="p-8 md:p-12">
                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="flex flex-wrap gap-2 mb-8"
                                    >
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mr-4">
                                            <Tag className="w-4 h-4" />
                                            <span>Tags:</span>
                                        </div>
                                        {post.tags.map((tag) => (
                                            <Badge 
                                                key={tag} 
                                                variant="outline" 
                                                className="border-[#2347FA]/20 text-[#2347FA] hover:bg-[#2347FA] hover:text-white transition-all duration-300 cursor-pointer rounded-full px-3 py-1"
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Article Content */}
                                <motion.article 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="prose prose-lg max-w-none"
                                >
                                    <style>{`
                                        .blog-content h2 {
                                            color: #1f2937;
                                            font-size: 2rem;
                                            font-weight: 700;
                                            margin-top: 3rem;
                                            margin-bottom: 1.5rem;
                                            padding-bottom: 0.75rem;
                                            border-bottom: 3px solid #2347FA;
                                            position: relative;
                                        }
                                        .blog-content h2::after {
                                            content: '';
                                            position: absolute;
                                            bottom: -3px;
                                            left: 0;
                                            width: 60px;
                                            height: 3px;
                                            background: linear-gradient(45deg, #2347FA, #3b56fc);
                                        }
                                        .blog-content h3 {
                                            color: #374151;
                                            font-size: 1.5rem;
                                            font-weight: 600;
                                            margin-top: 2rem;
                                            margin-bottom: 1rem;
                                            position: relative;
                                            padding-left: 1rem;
                                        }
                                        .blog-content h3::before {
                                            content: '';
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            bottom: 0;
                                            width: 4px;
                                            background: linear-gradient(to bottom, #2347FA, #3b56fc);
                                            border-radius: 2px;
                                        }
                                        .blog-content h4 {
                                            color: #4b5563;
                                            font-size: 1.25rem;
                                            font-weight: 600;
                                            margin-top: 1.5rem;
                                            margin-bottom: 0.75rem;
                                        }
                                        .blog-content p {
                                            color: #4b5563;
                                            line-height: 1.8;
                                            margin-bottom: 1.5rem;
                                            text-align: justify;
                                        }
                                        .blog-content ul, .blog-content ol {
                                            margin: 1.5rem 0;
                                            padding-left: 2rem;
                                        }
                                        .blog-content li {
                                            color: #4b5563;
                                            margin-bottom: 0.75rem;
                                            line-height: 1.7;
                                        }
                                        .blog-content li::marker {
                                            color: #2347FA;
                                            font-weight: bold;
                                        }
                                        .blog-content strong {
                                            color: #1f2937;
                                            font-weight: 700;
                                        }
                                        .blog-content em {
                                            color: #2347FA;
                                            font-style: normal;
                                            font-weight: 600;
                                            background: linear-gradient(120deg, #2347FA20 0%, #2347FA20 100%);
                                            padding: 2px 6px;
                                            border-radius: 4px;
                                        }
                                        .blog-content hr {
                                            margin: 3rem 0;
                                            border: none;
                                            height: 2px;
                                            background: linear-gradient(to right, transparent, #2347FA, transparent);
                                        }
                                        .blog-content a {
                                            color: #2347FA;
                                            text-decoration: underline;
                                            text-decoration-color: #2347FA50;
                                            text-underline-offset: 3px;
                                            font-weight: 500;
                                            transition: all 0.2s ease;
                                        }
                                        .blog-content a:hover {
                                            color: #3b56fc;
                                            text-decoration-color: #2347FA;
                                            text-decoration-thickness: 2px;
                                        }
                                        .blog-content blockquote {
                                            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                                            border-left: 4px solid #2347FA;
                                            padding: 1.5rem 2rem;
                                            margin: 2rem 0;
                                            border-radius: 0 12px 12px 0;
                                            font-style: italic;
                                            color: #475569;
                                            position: relative;
                                        }
                                        .blog-content blockquote::before {
                                            content: '"';
                                            font-size: 4rem;
                                            color: #2347FA30;
                                            position: absolute;
                                            top: -10px;
                                            left: 15px;
                                            font-family: Georgia, serif;
                                        }
                                        .blog-content code:not(pre code) {
                                            background: #f1f5f9;
                                            color: #2347FA;
                                            padding: 2px 8px;
                                            border-radius: 6px;
                                            font-weight: 600;
                                            font-size: 0.9em;
                                            border: 1px solid #e2e8f0;
                                        }
                                        .blog-content pre {
                                            background: #1e293b;
                                            color: #e2e8f0;
                                            padding: 1.5rem;
                                            border-radius: 12px;
                                            overflow-x: auto;
                                            margin: 2rem 0;
                                            border: 1px solid #334155;
                                        }
                                        .blog-content pre code {
                                            background: none;
                                            color: inherit;
                                            padding: 0;
                                            border: none;
                                            font-weight: normal;
                                        }
                                    `}</style>
                                    <div 
                                        className="blog-content"
                                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                                    />
                                </motion.article>

                                {/* Share Section */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="mt-12 pt-8 border-t border-gray-200"
                                >
                                    <div className="flex flex-col md:flex-row items-center justify-between">
                                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                            <Share2 className="w-5 h-5 text-[#2347FA]" />
                                            <span className="font-semibold text-gray-900">Bagikan artikel ini:</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <a 
                                                href={shareLinks.facebook} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                                            >
                                                <Facebook className="w-4 h-4" />
                                                <span className="text-sm font-medium">Facebook</span>
                                            </a>
                                            <a 
                                                href={shareLinks.twitter} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 transition-colors"
                                            >
                                                <Twitter className="w-4 h-4" />
                                                <span className="text-sm font-medium">Twitter</span>
                                            </a>
                                            <a 
                                                href={shareLinks.linkedin} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                <span className="text-sm font-medium">LinkedIn</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Artikel Terkait</h2>
                                <p className="text-lg text-gray-600">Eksplorasi lebih banyak konten menarik</p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedPosts.slice(0, 3).map((relatedPost, index) => (
                                    <motion.article
                                        key={relatedPost.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            delay: 0.2 + (index * 0.1),
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                        className="group cursor-pointer"
                                    >
                                        <Card className="overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group-hover:shadow-[#2347FA]/10 h-full flex flex-col">
                                            {relatedPost.featured_image ? (
                                                <div className="aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={`/storage/${relatedPost.featured_image}`}
                                                        alt={relatedPost.title}
                                                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[16/10] bg-gradient-to-br from-[#2347FA]/10 via-blue-100 to-indigo-100 flex items-center justify-center">
                                                    <BookOpen className="h-12 w-12 text-[#2347FA]/60" />
                                                </div>
                                            )}
                                            
                                            <CardContent className="p-6 flex-1 flex flex-col">
                                                <Badge className="bg-[#2347FA]/10 text-[#2347FA] border-[#2347FA]/20 w-fit mb-3 rounded-full">
                                                    {relatedPost.category}
                                                </Badge>
                                                
                                                <h3 className="font-bold text-lg text-gray-900 transition-colors group-hover:text-[#2347FA] leading-tight line-clamp-2 mb-3">
                                                    {relatedPost.title}
                                                </h3>
                                                
                                                <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm flex-1 mb-4">
                                                    {relatedPost.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatReadingTime(relatedPost.reading_time)}</span>
                                                    </div>
                                                    <Link href={`/blog/${relatedPost.slug || relatedPost.id}`}>
                                                        <Button size="sm" className="bg-[#2347FA] hover:bg-[#3b56fc] text-white rounded-full">
                                                            Baca
                                                            <ArrowRight className="ml-1 w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.article>
                                ))}
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="text-center mt-12"
                            >
                                <Link href="/blog">
                                    <Button className="bg-gradient-to-r from-[#2347FA] to-blue-600 hover:from-[#1e40e0] hover:to-[#2347FA] text-white font-semibold px-8 py-3 rounded-full">
                                        Lihat Semua Artikel
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )}

                <ModernFooter />
            </div>
        </>
    );
}