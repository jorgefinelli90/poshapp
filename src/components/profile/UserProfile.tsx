import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../ui/Button';

const UserProfile = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-surface rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <h2 className="font-semibold text-lg">
            {user?.displayName || 'User'}
          </h2>
          <p className="text-text-light text-sm">
            {user?.email}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleSignOut}
      >
        <LogOut size={18} />
        Sign Out
      </Button>
    </div>
  );
};

export default UserProfile;