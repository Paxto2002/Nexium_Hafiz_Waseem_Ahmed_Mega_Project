"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

export default function PricingPageClient() {
  const [selectedPlan, setSelectedPlan] = useState("Pro"); // Default highlighted

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="min-h-screen bg-white py-20 px-6"
    >
      {/* Header */}
      <motion.section
        variants={fadeUp}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Whether you're an occasional cook or a recipe wizard — we’ve got a plan for you.
        </p>
      </motion.section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          {
            name: "Free",
            price: "PKR 0",
            features: [
              "5 recipes/day",
              "Basic AI generation",
              "Save up to 10 recipes",
              "Community support",
            ],
          },
          {
            name: "Pro",
            price: "PKR 999/mo",
            features: [
              "Unlimited recipes",
              "Premium AI (LLaMA 3 70B)",
              "Nutrition analysis",
              "Smart shopping lists",
              "Priority support",
            ],
          },
          {
            name: "Team",
            price: "PKR 2499/mo",
            features: [
              "Everything in Pro",
              "Team recipe sharing",
              "Analytics & reports",
              "Early access to features",
            ],
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <PricingCard
              name={plan.name}
              price={plan.price}
              features={plan.features}
              isSelected={selectedPlan === plan.name}
              onClick={() => setSelectedPlan(plan.name)}
            />
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        className="text-center mt-20"
      >
        <Badge variant="outline" className="text-green-700 border-green-600 mb-4">
          Pay only if it’s worth it
        </Badge>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Try Chef Paxto free, upgrade anytime.
        </h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button asChild className="text-lg  px-6 py-4 rounded-xl">
            <a href="/signup" className="text-white bg[#4FA740]">Start for Free</a>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PricingCard({ name, price, features, isSelected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={onClick}
        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all select-none ${
          isSelected
            ? "border-green-600 bg-green-50 shadow-lg scale-[1.03]"
            : "border-gray-200 hover:border-green-400 hover:shadow-md"
        }`}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-3xl font-extrabold text-green-700 mb-4">{price}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="text-gray-600">
              ✅ {feature}
            </li>
          ))}
        </ul>
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full cursor-not-allowed"
          disabled
        >
          {isSelected ? "Selected" : "Choose Plan"}
        </Button>
      </Card>
    </motion.div>
  );
}
