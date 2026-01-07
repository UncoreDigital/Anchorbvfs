import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Clock, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';

const Events = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const events = [
        {
            title: 'Adequate Consideration Status Update',
            date: 'October 8, 2025',
            time: '11 a.m. – 1 p.m. EST',
            location: 'Virtual (via NACVA)',
            presenters: ['Trisch Garthoeffner', 'Greg Caruso'],
            description: 'Presenter(s): Trisch Garthoeffner & Greg Caruso.',
            link: null
        },
        {
            title: 'NAVA Las Vegas 2024 Conference Speaker',
            date: 'Las Vegas 2024',
            time: '',
            location: 'Las Vegas',
            presenters: ['Trisch Garthoeffner', 'Greg Caruso'],
            description: 'NAVA Las Vegas 2024 Conference Speaker.',
            link: 'https://www.youtube.com/watch?v=DDNLa9p8IFI'
        },
        {
            title: 'Divorce Valuations in the State of Florida',
            date: 'April 3, 2025',
            time: '11:30 a.m. – 1 p.m. EST',
            location: 'Pincher’s Marina at Edison Ford (2360 W. First St, Fort Myers, FL 33901)',
            presenters: ['Trisch Garthoeffner'],
            description: 'Divorce Valuations in the State of Florida.',
            link: null
        },
        {
            title: 'Valuations in State of Florida for Association of Family Law Professionals',
            date: 'March 6, 2025',
            time: '11:30 a.m. – 1 p.m. EST',
            location: 'Virtual (via https://aflpnetwork.com/)',
            presenters: ['Trisch Garthoeffner'],
            description: 'Valuations in State of Florida for Association of Family Law Professionals in Fort Myers.',
            link: 'https://aflpnetwork.com/'
        },
        {
            title: 'Naples City Lifestyle Ladies Luncheon',
            date: 'October 4, 2023',
            time: '11:30 a.m.',
            location: 'Del Mar, 494 5th Ave S, Naples, FL 34102',
            presenters: ['Trisch Garthoeffner'],
            description: 'Naples City Lifestyle Ladies Luncheon speaker discussing valuation and M&A trends.',
            link: null
        },
        {
            title: 'Business Valuation & Financial Litigation Hybrid & Virtual Super Conferences',
            date: 'September 21-22, 2023',
            time: '',
            location: 'Virtual',
            presenters: ['Trisch Garthoeffner'],
            description: 'Business Valuation & Financial Litigation Hybrid & Virtual Super Conferences.',
            link: 'https://www.nacva.com/conferences'
        },
        {
            title: 'Business Valuation & Financial Litigation Hybrid & Virtual Super Conferences',
            date: 'December 14-16, 2022',
            time: '',
            location: 'Park City, UT & Fort Lauderdale, FL',
            presenters: ['Trisch Garthoeffner', 'Mark Kucik'],
            description: 'Business Valuation & Financial Litigation Hybrid & Virtual Super Conferences.',
            link: null
        },
        {
            title: 'Industry Standards and Ethics',
            date: 'October 19, 2022',
            time: '1:30 p.m. EST',
            location: 'Consultants’ Training Institute',
            presenters: ['Trisch Garthoeffner'],
            description: 'Industry Standards and Ethics presentation.',
            link: null
        },
        {
            title: 'Business Valuations (Lee County Bar Association)',
            date: 'October 14, 2022',
            time: '12:00 p.m. – 1:00 p.m.',
            location: 'Virtual (https://www.leebar.org/civicrm/event/)',
            presenters: ['Trisch Garthoeffner'],
            description: 'Business Valuations for the Lee County Bar Association Real Property, Probate and Trust Law Section.',
            link: 'https://www.leebar.org/civicrm/event/'
        },
        {
            title: '2022 Business Valuation and Financial Litigation Hybrid Super Conference',
            date: 'August 17, 2022',
            time: '8:30 a.m. – 5:00 p.m. MDT',
            location: '500 South Main, Salt Lake City, UT United States 84101',
            presenters: ['Trisch Garthoeffner'],
            description: '2022 Business Valuation and Financial Litigation Hybrid Super Conference.',
            link: null
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <PageBanner
                title="Events & Speaking"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Events' }
                ]}
            />

            <section className="section-padding bg-background">
                <div className="container-wide">
                    <div className="text-center mb-16">
                        <span className="text-accent font-inter font-semibold text-sm tracking-wider uppercase mb-4 block">
                            Join Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6">
                            Upcoming & Past Events
                        </h2>
                        <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
                            Stay updated with our latest speaking engagements, conferences, and presentations.
                        </p>
                    </div>

                    <div className="grid gap-8 max-w-5xl mx-auto">
                        {events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-xl p-6 md:p-8 border border-border hover:shadow-elegant transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    {/* Date Badge */}
                                    <div className="flex-shrink-0">
                                        <div className="bg-accent/10 rounded-lg p-4 text-center min-w-[100px]">
                                            <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
                                            <span className="block text-sm font-bold text-primary/80">
                                                {event.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow space-y-3">
                                        <h3 className="text-xl md:text-2xl font-playfair font-bold text-primary">
                                            {event.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-inter">
                                            {event.time && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-accent" />
                                                    <span>{event.time}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-accent" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                            <User className="w-4 h-4 text-accent" />
                                            <span>{event.presenters.join(', ')}</span>
                                        </div>

                                        <p className="text-muted-foreground font-inter leading-relaxed pt-2">
                                            {event.description}
                                        </p>

                                        {event.link && (
                                            <div className="pt-2">
                                                <a
                                                    href={event.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                                                >
                                                    View Event Details <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Events;
