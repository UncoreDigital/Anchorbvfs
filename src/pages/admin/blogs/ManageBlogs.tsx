
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
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
import { format } from 'date-fns';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error: any) {
            toast.error('Error fetching blogs: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) throw error;

            setBlogs(blogs.filter(blog => blog.id !== id));
            toast.success('Blog deleted successfully');
        } catch (error: any) {
            toast.error('Error deleting blog: ' + error.message);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-playfair font-bold text-gray-900">Manage Blogs</h1>
                    <p className="text-gray-500 text-sm">Create, edit, and manage your blog posts</p>
                </div>
                <Link to="/admin/blogs/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Blog
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search blogs..."
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
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading content...</TableCell>
                                </TableRow>
                            ) : filteredBlogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">No blogs found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell className="font-medium max-w-xs truncate" title={blog.title}>
                                            {blog.title}
                                        </TableCell>
                                        <TableCell>{blog.author}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {blog.category}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/blogs/${blog.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(blog.id)}
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

export default ManageBlogs;
