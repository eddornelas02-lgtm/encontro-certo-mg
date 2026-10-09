import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthTest from './pages/AuthTest';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/descobrir/*" element={<Index />} />
        <Route path="/hoje/*" element={<Index />} />
        <Route path="/carteira/*" element={<Index />} />
        <Route path="/matches/*" element={<Index />} />
        <Route path="/conversas/*" element={<Index />} />
        <Route path="/perfil/*" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
