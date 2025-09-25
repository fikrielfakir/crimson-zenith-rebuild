import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  Search,
  Filter,
  Eye,
  Calendar,
  User
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  views: number;
}

const NewsManagement = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Atlas Mountains Open New Trekking Routes for 2025",
      excerpt: "Discover newly accessible high-altitude trails that offer breathtaking views and challenging terrain for experienced hikers.",
      content: "The High Atlas Mountains have unveiled three spectacular new trekking routes...",
      author: "Rachid Benali",
      date: "2024-12-15",
      category: "Adventure Tips",
      readTime: "5 min read",
      tags: ["trekking", "atlas", "routes", "2025"],
      featured: true,
      status: "published",
      views: 1250
    },
    {
      id: 2,
      title: "Essential Safety Guidelines for Desert Adventures",
      excerpt: "Updated safety protocols and equipment recommendations for Sahara Desert expeditions during peak season.",
      content: "As we enter the optimal desert season, our safety team has compiled...",
      author: "Dr. Laila Mansouri",
      date: "2024-12-12",
      category: "Safety Updates",
      readTime: "8 min read",
      tags: ["safety", "desert", "equipment"],
      featured: false,
      status: "published",
      views: 890
    },
    {
      id: 3,
      title: "Member Spotlight: From Beginner to Mountain Guide",
      excerpt: "Hassan's inspiring journey from his first club hike to becoming a certified mountain guide in just two years.",
      content: "Two years ago, Hassan attended his first Atlas Hikers meetup...",
      author: "Fatima El-Khoury",
      date: "2024-12-10",
      category: "Member Spotlights",
      readTime: "6 min read",
      tags: ["member", "guide", "inspiration"],
      featured: false,
      status: "draft",
      views: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Adventure Tips',
    readTime: '5 min read',
    tags: [],
    featured: false,
    status: 'draft',
    views: 0
  });

  const categories = ['Adventure Tips', 'Safety Updates', 'Member Spotlights', 'Gear Reviews', 'Cultural Insights', 'Event News'];
  const statuses = ['draft', 'published', 'archived'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateArticle = () => {
    // Validation
    if (!newArticle.title?.trim()) {
      alert('Article title is required');
      return;
    }
    if (!newArticle.excerpt?.trim()) {
      alert('Article excerpt is required');
      return;
    }
    if (!newArticle.content?.trim()) {
      alert('Article content is required');
      return;
    }
    if (!newArticle.author?.trim()) {
      alert('Author name is required');
      return;
    }
    if (!newArticle.date) {
      alert('Publication date is required');
      return;
    }

    // Generate safe ID
    const nextId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
    
    const article: Article = {
      id: nextId,
      title: newArticle.title.trim(),
      excerpt: newArticle.excerpt.trim(),
      content: newArticle.content.trim(),
      author: newArticle.author.trim(),
      date: newArticle.date,
      category: newArticle.category || 'Adventure Tips',
      readTime: newArticle.readTime || '5 min read',
      tags: newArticle.tags || [],
      featured: newArticle.featured || false,
      status: newArticle.status || 'draft',
      views: 0
    } as Article;
    setArticles([...articles, article]);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Adventure Tips',
      readTime: '5 min read',
      tags: [],
      featured: false,
      status: 'draft',
      views: 0
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateArticle = () => {
    if (!editingArticle) return;

    // Validation
    if (!editingArticle.title?.trim()) {
      alert('Article title is required');
      return;
    }
    if (!editingArticle.excerpt?.trim()) {
      alert('Article excerpt is required');
      return;
    }
    if (!editingArticle.content?.trim()) {
      alert('Article content is required');
      return;
    }
    if (!editingArticle.author?.trim()) {
      alert('Author name is required');
      return;
    }
    if (!editingArticle.date) {
      alert('Publication date is required');
      return;
    }

    const updatedArticle = {
      ...editingArticle,
      title: editingArticle.title.trim(),
      excerpt: editingArticle.excerpt.trim(),
      content: editingArticle.content.trim(),
      author: editingArticle.author.trim()
    };

    setArticles(articles.map(article => article.id === editingArticle.id ? updatedArticle : article));
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const addTag = (articleRef: any, setArticleRef: any) => {
    const tag = prompt('Enter new tag:');
    if (tag && tag.trim()) {
      setArticleRef({
        ...articleRef,
        tags: [...(articleRef.tags || []), tag.trim().toLowerCase()]
      });
    }
  };

  const removeTag = (articleRef: any, setArticleRef: any, index: number) => {
    setArticleRef({
      ...articleRef,
      tags: articleRef.tags.filter((_: any, i: number) => i !== index)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ArticleForm = ({ article, setArticle, onSave, title }: any) => (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            value={article.title}
            onChange={(e) => setArticle({...article, title: e.target.value})}
            placeholder="Enter article title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={article.author}
            onChange={(e) => setArticle({...article, author: e.target.value})}
            placeholder="Author name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={article.excerpt}
          onChange={(e) => setArticle({...article, excerpt: e.target.value})}
          placeholder="Brief summary of the article"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={article.content}
          onChange={(e) => setArticle({...article, content: e.target.value})}
          placeholder="Full article content"
          rows={8}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={article.date}
            onChange={(e) => setArticle({...article, date: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time</Label>
          <Input
            id="readTime"
            value={article.readTime}
            onChange={(e) => setArticle({...article, readTime: e.target.value})}
            placeholder="5 min read"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={article.category} onValueChange={(value) => setArticle({...article, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={article.status} onValueChange={(value) => setArticle({...article, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {article.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="cursor-pointer">
              {tag}
              <button
                onClick={() => removeTag(article, setArticle, index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag(article, setArticle)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={article.featured}
          onChange={(e) => setArticle({...article, featured: e.target.checked})}
        />
        <Label htmlFor="featured">Featured Article</Label>
      </div>
      <Button onClick={onSave} className="w-full">
        Save Article
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">News Management</h1>
            <p className="text-muted-foreground">Manage your articles and blog posts</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Write New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ArticleForm
                article={newArticle}
                setArticle={setNewArticle}
                onSave={handleCreateArticle}
                title="Create New Article"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">Live articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.status === 'draft').length}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All articles</p>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{article.title}</h3>
                        {article.featured && (
                          <Badge variant="default" className="mb-2">Featured</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                        <Badge variant="outline">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views.toLocaleString()} views
                      </div>
                      <div>
                        {article.readTime}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingArticle(article)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        {editingArticle && (
                          <ArticleForm
                            article={editingArticle}
                            setArticle={setEditingArticle}
                            onSave={handleUpdateArticle}
                            title="Edit Article"
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                          handleDeleteArticle(article.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsManagement;