import React from 'react';
import { Heart, Target, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageContainer from '../components/layout/PageContainer';

const Home = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posh App</h1>
        <Heart className="text-primary" size={24} />
      </div>
      
      <Card className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Today's Memory</h2>
        <p className="text-text-light">Share a special moment from your day...</p>
        <Button className="mt-4 w-full">
          Create Memory
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Target className="text-primary mb-2" size={24} />
          <h3 className="font-semibold mb-2">Goals</h3>
          <p className="text-sm text-text-light">2 pending</p>
        </Card>
        <Card>
          <ShoppingBag className="text-primary mb-2" size={24} />
          <h3 className="font-semibold mb-2">Shopping List</h3>
          <p className="text-sm text-text-light">5 items</p>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Home;