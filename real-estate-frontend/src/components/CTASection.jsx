import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    ArrowRightIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function CTASection() {
    const features = [
        {
            icon: <HomeIcon className="w-6 h-6" />,
            title: 'Find Your Dream Home',
            description: 'Browse through our curated selection of properties'
        },
        {
            icon: <BuildingOfficeIcon className="w-6 h-6" />,
            title: 'Premium Locations',
            description: 'Discover properties in the most sought-after areas'
        },
        {
            icon: <ShieldCheckIcon className="w-6 h-6" />,
            title: 'Secure Transactions',
            description: 'Your safety and security are our top priorities'
        },
        {
            icon: <UserGroupIcon className="w-6 h-6" />,
            title: 'Expert Support',
            description: '24/7 support from our experienced team'
        }
    ];

    return (
        <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-y-0 right-1/2 w-screen bg-gradient-to-r from-primary-50 to-primary-100/50 transform skew-y-6 -rotate-6 origin-top-right" />
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[200%] aspect-[1/0.8] bg-gradient-to-b from-white/0 via-primary-100/10 to-white/0 transform rotate-[-12deg]" />
            </div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-16 items-center">
                        {/* Content */}
                        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900"
                            >
                                Find Your Perfect Property
                                <span className="block mt-2 text-primary-600">With Confidence</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="mt-6 text-base sm:text-lg text-gray-600"
                            >
                                Experience the future of real estate. Browse through our extensive collection of properties
                                and find the perfect place to call home.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    to="/properties"
                                    className="btn btn-primary inline-flex items-center justify-center group"
                                >
                                    Browse Properties
                                    <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="btn btn-secondary inline-flex items-center justify-center"
                                >
                                    Contact Us
                                </Link>
                            </motion.div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                                    className="relative p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 