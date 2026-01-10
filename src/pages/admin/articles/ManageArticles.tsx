
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const ManageArticles = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('published_at', { ascending: false });

            if (error) throw error;
            setArticles(data || []);
        } catch (error: any) {
            toast.error('Error fetching articles: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw error;

            setArticles(articles.filter(item => item.id !== id));
            toast.success('Deleted successfully');
        } catch (error: any) {
            toast.error('Error deleting item: ' + error.message);
        }
    };

    const filteredArticles = articles.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-playfair font-bold text-gray-900">Articles & Podcasts</h1>
                    <p className="text-gray-500 text-sm">Manage external resources links</p>
                </div>
                <Link to="/admin/articles/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Item
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Date Display</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading content...</TableCell>
                                </TableRow>
                            ) : filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No items found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium max-w-xs truncate" title={item.title}>
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Podcast' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>{item.published_at}</TableCell>
                                        <TableCell>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/articles/${item.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ManageArticles;
