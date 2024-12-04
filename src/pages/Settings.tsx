import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import UserProfile from '../components/profile/UserProfile';
import { Bell, Palette } from 'lucide-react';

const Settings = () => {
  const settingsItems = [
    { icon: Bell, label: 'Notifications', onClick: () => {} },
    { icon: Palette, label: 'Appearance', onClick: () => {} },
  ];

  return (
    <PageContainer title="Settings">
      <UserProfile />
      
      <Card>
        <div className="divide-y">
          {settingsItems.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <Icon size={20} className="text-gray-500" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default Settings;