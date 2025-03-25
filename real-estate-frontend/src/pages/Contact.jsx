import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PhoneIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    MapPinIcon,
    ClockIcon,
    BuildingOfficeIcon,
    ArrowRightIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import { PageTransition, FadeIn, SlideIn, StaggerChildren, StaggerItem } from '../components/PageAnimations';

export default function Contact() {
    const location = useLocation();
    const [contactMethod, setContactMethod] = useState('whatsapp');
    const [showSuccess, setShowSuccess] = useState(false);
    const [formStatus, setFormStatus] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredDate: '',
        preferredTime: '',
        propertyInterest: location.state?.propertyId || ''
    });

    useEffect(() => {
        if (location.state?.propertyId) {
            setFormData(prev => ({
                ...prev,
                propertyInterest: location.state.propertyId
            }));
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        const message = `
Hello, I would like to make a reservation!

Property of Interest: ${formData.propertyInterest}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}

Message: ${formData.message}
        `.trim();

        try {
            switch (contactMethod) {
                case 'whatsapp':
                    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`);
                    break;
                case 'email':
                    window.open(`mailto:contact@realestate.com?subject=Property Reservation Request - ${formData.propertyInterest}&body=${encodeURIComponent(message)}`);
                    break;
                case 'phone':
                    window.open('tel:1234567890');
                    break;
            }
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setTimeout(() => setFormStatus('idle'), 3000);
    };

    const contactMethods = [
        {
            id: 'whatsapp',
            icon: ChatBubbleLeftRightIcon,
            label: 'WhatsApp',
            color: 'green'
        },
        {
            id: 'email',
            icon: EnvelopeIcon,
            label: 'Email',
            color: 'blue'
        },
        {
            id: 'phone',
            icon: PhoneIcon,
            label: 'Phone',
            color: 'purple'
        }
    ];

    const contactInfo = [
        {
            icon: PhoneIcon,
            label: 'Phone',
            primary: '+1 (234) 567-890',
            link: 'tel:+1234567890'
        },
        {
            icon: EnvelopeIcon,
            label: 'Email',
            primary: 'contact@realestate.com',
            link: 'mailto:contact@realestate.com'
        },
        {
            icon: MapPinIcon,
            label: 'Address',
            primary: '123 Real Estate Street',
            secondary: 'New York, NY 10001',
            link: 'https://maps.google.com/?q=123+Real+Estate+Street+New+York+NY+10001'
        },
        {
            icon: ClockIcon,
            label: 'Business Hours',
            primary: 'Mon - Fri: 9:00 AM - 6:00 PM',
            secondary: 'Sat: 10:00 AM - 4:00 PM'
        }
    ];

    return (
        <AnimatePresence mode="wait">
            <PageTransition key="contact">
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                    {/* Enhanced Hero Section */}
                    <div className="relative h-[600px] overflow-hidden">
                        {/* Background Image Layer */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
                            }}
                        />

                        {/* Overlay Layers */}
                        <div className="absolute inset-0 bg-black opacity-60"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-900/50 to-blue-950/80"></div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center"
                            >
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                                    Get in Touch
                                </h1>
                                <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                                    Let us help you find your dream property. Our team of experts is ready to assist you.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center"
                            >
                                <CheckCircleIcon className="h-6 w-6 mr-2" />
                                Message sent successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Contact Information Card */}
                            <SlideIn direction="left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300"
                                >
                                    <div className="relative">
                                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 shadow-xl">
                                                <BuildingOfficeIcon className="h-8 w-8 text-white" />
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Contact Information</h2>
                                            <div className="space-y-6">
                                                {contactInfo.map((item, index) => (
                                                    <motion.a
                                                        key={index}
                                                        href={item.link}
                                                        target={item.link?.startsWith('http') ? '_blank' : undefined}
                                                        rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                                                        whileHover={{ scale: 1.02 }}
                                                    >
                                                        <item.icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                                                        <div className="ml-4">
                                                            <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                                            <p className="text-lg font-semibold text-gray-900">{item.primary}</p>
                                                            {item.secondary && (
                                                                <p className="text-gray-600">{item.secondary}</p>
                                                            )}
                                                        </div>
                                                    </motion.a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SlideIn>

                            {/* Contact Form Card */}
                            <SlideIn direction="right">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Make a Reservation</h2>

                                    {/* Contact Method Selection */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Contact Method</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {contactMethods.map((method) => (
                                                <motion.button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setContactMethod(method.id)}
                                                    className={`flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 ${contactMethod === method.id
                                                        ? `bg-${method.color}-500 text-white shadow-lg shadow-${method.color}-200`
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <method.icon className="h-5 w-5 mr-2" />
                                                    {method.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Property of Interest</label>
                                            <input
                                                type="text"
                                                name="propertyInterest"
                                                value={formData.propertyInterest}
                                                onChange={handleInputChange}
                                                placeholder="Enter property name or ID"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            />
                                        </motion.div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            />
                                        </motion.div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                                                <input
                                                    type="date"
                                                    name="preferredDate"
                                                    value={formData.preferredDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                                                <input
                                                    type="time"
                                                    name="preferredTime"
                                                    value={formData.preferredTime}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Tell us more about your requirements..."
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            <button
                                                type="submit"
                                                className={`w-full flex items-center justify-center py-4 px-6 rounded-lg shadow-lg text-white font-medium text-lg transition-all duration-200 ${contactMethod === 'whatsapp'
                                                    ? 'bg-green-500 hover:bg-green-600 shadow-green-200'
                                                    : contactMethod === 'email'
                                                        ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
                                                        : 'bg-purple-500 hover:bg-purple-600 shadow-purple-200'
                                                    }`}
                                                disabled={formStatus === 'submitting'}
                                            >
                                                {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : contactMethod === 'whatsapp'
                                                    ? 'Send WhatsApp Message'
                                                    : contactMethod === 'email'
                                                        ? 'Send Email'
                                                        : 'Make Phone Call'}
                                                <ArrowRightIcon className="h-5 w-5 ml-2" />
                                            </button>
                                        </motion.div>
                                    </form>
                                </motion.div>
                            </SlideIn>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </AnimatePresence>
    );
} 