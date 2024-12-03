import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Heart, ShoppingBag, List, ShoppingCart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/memories', icon: Heart, label: 'Memories' },
    { path: '/lists', icon: List, label: 'Lists' },
    { path: '/shopping', icon: ShoppingCart, label: 'Shopping' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 w-full bg-surface border-t border-gray-200 px-4 py-2"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <motion.button
            key={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
            whileTap={{ scale: 0.9 }}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;