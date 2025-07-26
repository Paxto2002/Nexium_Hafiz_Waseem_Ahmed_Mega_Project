'use client';

import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 10
    }
  }
};

export default function EmailSentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 max-w-lg w-full text-center space-y-6"
      >
        <motion.div 
          variants={iconVariants}
          className="flex justify-center"
        >
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800"
        >
          ✅ Check your inbox!
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-gray-600 text-lg"
        >
          We've sent a secure sign-in link to your email address.
        </motion.p>

        <motion.p 
          variants={itemVariants}
          className="text-gray-500 text-sm"
        >
          You can safely close this tab now. Once you click the link in your inbox, you'll be redirected to your dashboard.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="pt-4"
        >
          <span className="text-sm text-gray-400">Chef Paxto 🍳</span>
        </motion.div>
      </motion.div>
    </div>
  );
}