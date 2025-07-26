"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from 'next/link';

// Enhanced animation variants with scroll triggers
const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: 'blur(5px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      type: "spring",
      stiffness: 100,
      damping: 15
    },
  }
};

const cardHover = {
  y: -8,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 15
  }
};

const buttonHover = {
  scale: 1.05,
  transition: { 
    type: "spring", 
    stiffness: 400, 
    damping: 10 
  }
};

export default function DocsClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { 
            transition: { 
              staggerChildren: 0.1,
              when: "beforeChildren"
            } 
          }
        }}
        className="text-center py-28 relative overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-green-400/20 blur-xl" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeUp}>
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
              Chef Paxto Documentation
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
              Master Chef Paxto
            </span>
          </motion.h1>
          
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            Learn how to use Chef Paxto to generate recipes using AI, save and manage your personal recipe vault, and explore the magic behind the scenes.
          </motion.p>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { 
            transition: { 
              staggerChildren: 0.1,
              when: "beforeChildren"
            } 
          }
        }}
        className="max-w-6xl mx-auto px-6 py-16"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🧠</span> How It Works
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Submit Ingredients",
              desc: "Tell Paxto what you have — like 'chicken, garlic, lemon'.",
              icon: "🥕"
            },
            {
              title: "2. AI Creates Recipe",
              desc: "LLaMA 3 70B generates a delicious recipe with steps & tips.",
              icon: "🤖"
            },
            {
              title: "3. Save & Explore",
              desc: "Save your recipes and explore them in your dashboard anytime.",
              icon: "📚"
            },
          ].map(({ title, desc, icon }, i) => (
            <motion.div 
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              whileHover={cardHover}
            >
              <Card className="p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all h-full bg-white">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-green-700 mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Usage Guide */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { 
            transition: { 
              staggerChildren: 0.1,
              when: "beforeChildren"
            } 
          }
        }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📖</span> Step-by-Step Guide
          </h2>
        </motion.div>
        
        <motion.div 
          variants={fadeUp}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="p-8 rounded-2xl border border-green-100 bg-white">
            <div className="space-y-6">
              {[
                {
                  step: "1. Account Setup",
                  desc: "Sign up or sign in to access your dashboard",
                  icon: "👤"
                },
                {
                  step: "2. Input Ingredients",
                  desc: "Use the input field to enter ingredients in natural language",
                  icon: "✍️"
                },
                {
                  step: "3. Generate Recipe",
                  desc: "Wait for AI to generate a recipe. Review, edit, or favorite it",
                  icon: "⚡"
                },
                {
                  step: "4. Manage Recipes",
                  desc: "Access all your saved recipes from the dashboard anytime",
                  icon: "🗂️"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: i * 0.1
                  }}
                  className="flex gap-4 items-start"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-green-700">{item.step}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.section>

      {/* Developer Preview */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { 
            transition: { 
              staggerChildren: 0.1,
              when: "beforeChildren"
            } 
          }
        }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">💻</span> Developer API (Coming Soon)
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 rounded-2xl border border-green-100 bg-white overflow-hidden">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-100/30 blur-xl"></div>
              <p className="text-gray-600 mb-6">
                Soon you'll be able to use our public API to generate recipes via HTTP requests.
              </p>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-500/10 rounded-lg"></div>
                <pre className="relative bg-gray-900 text-green-300 text-sm p-6 rounded-lg overflow-x-auto">
{`POST https://api.chefpaxto.com/generate
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "ingredients": ["chicken", "rice", "garlic"],
  "dietary_preferences": ["low-carb"],
  "cuisine_style": "italian",
  "servings": 2
}`}
                </pre>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { 
            transition: { 
              staggerChildren: 0.1,
              when: "beforeChildren"
            } 
          }
        }}
        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20 rounded-3xl text-center relative overflow-hidden mx-6 mb-16"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.h2 
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Cook with AI?
          </motion.h2>
          
          <motion.p 
            variants={fadeUp}
            className="text-xl mb-8 text-emerald-100"
          >
            Head over to the dashboard and start generating magic recipes with Chef Paxto.
          </motion.p>
          
          <motion.div
            variants={fadeUp}
            whileHover={buttonHover}
          >
            <Button 
              asChild
              className="bg-white text-emerald-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}