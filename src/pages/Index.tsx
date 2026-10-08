import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { MainAppContainer } from '@/components/MainAppContainer';

export const Index: React.FC = () => {
  return (
    <AppProvider>
      <MainAppContainer />
    </AppProvider>
  );
};

export default Index;
