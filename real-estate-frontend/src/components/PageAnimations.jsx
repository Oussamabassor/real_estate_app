import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
    >
        {children}
    </motion.div>
);

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </div>
);

export const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, direction = "right", delay = 0 }) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === "right" ? 20 : direction === "left" ? -20 : 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerChildren = ({ children, staggerDelay = 0.1 }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay,
                },
            },
        }}
        initial="hidden"
        animate="show"
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
        }}
    >
        {children}
    </motion.div>
); 