import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Heart } from 'lucide-react';

const Memories = () => {
  return (
    <PageContainer title="Memories">
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-primary" size={24} />
          <h2 className="text-lg font-semibold">Your Memories</h2>
        </div>
        <p className="text-text-light mb-4">Capture and cherish your special moments together.</p>
        <Button className="w-full">
          Create New Memory
        </Button>
      </Card>
    </PageContainer>
  );
};

export default Memories;