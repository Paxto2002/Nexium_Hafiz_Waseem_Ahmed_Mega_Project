// components/motion-client.js
"use client";

import { motion } from "framer-motion";

const MotionComponent = ({ children, ...props }) => {
  return <motion.div {...props}>{children}</motion.div>;
};

export const Motion = {
  div: MotionComponent,
  h1: ({ children, ...props }) => <motion.h1 {...props}>{children}</motion.h1>,
  p: ({ children, ...props }) => <motion.p {...props}>{children}</motion.p>,
  section: ({ children, ...props }) => (
    <motion.section {...props}>{children}</motion.section>
  ),
  // Add other motion elements as needed
};

export default Motion;
