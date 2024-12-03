import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ShoppingBag, Target, UtensilsCrossed } from 'lucide-react';

const Lists = () => {
  return (
    <PageContainer title="Lists">
      <div className="grid gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Shopping List</h2>
          </div>
          <Button variant="outline" size="sm" className="w-full">View List</Button>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Goals</h2>
          </div>
          <Button variant="outline" size="sm" className="w-full">View Goals</Button>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="text-primary" size={24} />
            <h2 className="text-lg font-semibold">Recipes</h2>
          </div>
          <Button variant="outline" size="sm" className="w-full">View Recipes</Button>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Lists;