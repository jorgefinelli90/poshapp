import React from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <motion.div
      className="p-4 max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {title && (
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
      )}
      {children}
    </motion.div>
  );
};

export default PageContainer;