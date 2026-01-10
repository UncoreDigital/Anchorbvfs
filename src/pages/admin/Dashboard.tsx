
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Calendar, Files } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        blogs: 0,
        articles: 0,
        events: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { count: blogsCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
                const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
                const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

                setStats({
                    blogs: blogsCount || 0,
                    articles: articlesCount || 0,
                    events: eventsCount || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: 'Total Blogs', value: stats.blogs, icon: FileText, href: '/admin/blogs', color: 'text-blue-600', bg: 'bg-blue-50' },
        { name: 'Articles & Podcasts', value: stats.articles, icon: Files, href: '/admin/articles', color: 'text-purple-600', bg: 'bg-purple-50' },
        { name: 'Events', value: stats.events, icon: Calendar, href: '/admin/events', color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back to your administration panel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <Link
                        key={stat.name}
                        to={stat.href}
                        className="block p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                {loading ? (
                                    <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                )}
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity or Quick Actions could go here */}
        </div>
    );
};

export default Dashboard;
