"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      when: "beforeChildren",
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
};

const cardHover = {
  y: -8,
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 15,
  },
};

export default function HomeClient() {
  return (
    <div className="flex flex-col flex-1">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1"
      >
        {/* Hero Section */}
        <section className="py-16 text-center relative overflow-hidden bg-gradient-to-r from-green-100/50 to-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-green-400/20 blur-xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-xl"
          />

          <motion.div
            variants={containerVariants}
            className="max-w-5xl mx-auto px-6 z-10 relative"
          >
            <motion.div className="overflow-hidden mb-6">
              <motion.h1
                variants={textReveal}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                  AI-Powered
                </span>
                <br /> Recipe Generation
              </motion.h1>
            </motion.div>

            <motion.div className="overflow-hidden mb-10">
              <motion.p
                variants={textReveal}
                className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
              >
                Create delicious, personalized recipes in seconds with Chef
                Paxto's advanced AI.
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-row flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={buttonHover} className="w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="relative overflow-hidden inline-block w-full sm:w-auto text-center bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.span
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 mix-blend-overlay"
                    transition={{ duration: 0.4 }}
                  />
                </Link>
              </motion.div>

              <motion.div whileHover={buttonHover} className="w-full sm:w-auto">
                <Link
                  href="/features"
                  className="inline-block w-full sm:w-auto text-center border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50/50 font-semibold py-3 px-8 rounded-xl text-lg transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white/50 backdrop-blur-sm relative z-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ✨ Why People Love Chef Paxto
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the magic of AI-powered cooking
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Personalized Recipes",
                  desc: "Get recipes tailored to your dietary preferences and ingredients you have on hand.",
                  icon: "🍳",
                },
                {
                  title: "Nutrition Tracking",
                  desc: "Detailed nutritional info for every recipe to help you meet your health goals.",
                  icon: "📊",
                },
                {
                  title: "Smart Shopping",
                  desc: "Auto-generate shopping lists based on your meal plans and pantry items.",
                  icon: "🛒",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.15,
                    ease: "easeOut",
                  }}
                  whileHover={cardHover}
                  className="p-8 bg-white border border-green-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-100/30 blur-xl"></div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-green-700 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 max-w-4xl mx-auto px-6"
          >
            <motion.h2
              variants={textReveal}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your Cooking?
            </motion.h2>
            <motion.p
              variants={textReveal}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Join thousands of happy users creating amazing meals every day.
            </motion.p>
            <motion.div variants={fadeUp} whileHover={buttonHover}>
              <Link
                href="/signup"
                className="inline-block bg-white text-emerald-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Free Trial
              </Link>
            </motion.div>
            <motion.p variants={textReveal} className="mt-4 text-emerald-100">
              No credit card required. Cancel anytime.
            </motion.p>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
}