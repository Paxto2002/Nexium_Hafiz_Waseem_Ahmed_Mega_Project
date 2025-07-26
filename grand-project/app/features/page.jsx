'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const features = [
  {
    title: 'AI Recipe Generation',
    emoji: '🤖',
    description:
      'Turn any ingredient list into a step-by-step recipe using Groq-powered LLaMA 3.',
  },
  {
    title: 'Personalization',
    emoji: '🧠',
    description:
      'Recipes tailored to your dietary goals, cuisine preferences, and available ingredients.',
  },
  {
    title: 'Nutrition Insights',
    emoji: '📊',
    description:
      'Get instant calorie and macronutrient breakdowns for every generated recipe.',
  },
  {
    title: 'Smart Shopping',
    emoji: '🛒',
    description:
      'Auto-generate shopping lists based on your pantry and chosen meals.',
  },
  {
    title: 'Saved Recipes',
    emoji: '📚',
    description:
      'Bookmark and organize your favorite creations for easy access and review.',
  },
  {
    title: 'Secure Data Layer',
    emoji: '🧩',
    description:
      'Backed by Supabase and MongoDB for blazing fast and scalable storage.',
  },
];

export default function FeaturesPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white pb-24"
    >
      {/* Header */}
      <motion.section
        variants={fadeUp}
        className="bg-gradient-to-r from-green-100 to-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">
          Chef Paxto Features
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover what makes Chef Paxto your ultimate AI cooking companion.
        </p>
      </motion.section>

      {/* Feature Cards */}
      <motion.section
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
      >
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            title={feature.title}
            emoji={feature.emoji}
            description={feature.description}
          />
        ))}
      </motion.section>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        className="text-center mt-24 px-4"
      >
        <Badge variant="outline" className="text-green-700 border-green-600 mb-4">
          Constantly evolving
        </Badge>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          New features coming soon — powered by your feedback!
        </h2>
        <Button asChild className="text-lg text-white bg-[#4FA740] px-6 py-4 rounded-xl">
          <a href="/signup">Start Cooking with Chef Paxto</a>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({ title, emoji, description }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <Card className="p-6 rounded-2xl border border-green-100 hover:shadow-2xl bg-green-50 transition-all group h-full">
        <div className="text-4xl mb-3">{emoji}</div>
        <h3 className="text-xl font-semibold text-green-700 group-hover:underline mb-2">
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </motion.div>
  );
}