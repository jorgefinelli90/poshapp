import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { signInWithEmailAndPassword } = useAuthContext(); // Asegúrate de tener esta función en el contexto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred while signing in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <Heart className="text-primary w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Posh</h1>
          <p className="text-text-light">Your private space for moments together</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring focus:border-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <Button
            onClick={handleSignIn}
            className="w-full"
            size="lg"
            loading={loading}
          >
            Sign in with Email
          </Button>

          <p className="text-center text-sm text-text-light">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
