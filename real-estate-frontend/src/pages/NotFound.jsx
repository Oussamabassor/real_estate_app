import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center animate-fade-in">
                <div className="relative">
                    <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 animate-bounce" />
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
                </div>
                <h1 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">404</h1>
                <h2 className="mt-2 text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="mt-4 text-gray-500">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="mt-8 inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Home className="h-5 w-5 mr-2" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
