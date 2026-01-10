
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Calendar, MapPin } from 'lucide-react';
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

const ManageEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (error: any) {
            toast.error('Error fetching events: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase.from('events').delete().eq('id', id);
            if (error) throw error;

            setEvents(events.filter(event => event.id !== id));
            toast.success('Event deleted successfully');
        } catch (error: any) {
            toast.error('Error deleting event: ' + error.message);
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-playfair font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500 text-sm">Manage upcoming and past events</p>
                </div>
                <Link to="/admin/events/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search events..."
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
                                <TableHead>Event</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Loading content...</TableCell>
                                </TableRow>
                            ) : filteredEvents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">No events found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredEvents.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium max-w-xs truncate" title={event.title}>
                                            {event.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> {event.date}</span>
                                                {event.time && <span className="text-gray-500 text-xs pl-4">{event.time}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1 text-sm"><MapPin className="w-3 h-3 text-gray-400" /> {event.location}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/events/${event.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(event.id)}
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

export default ManageEvents;
