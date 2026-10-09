import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthTest from './pages/AuthTest';
import Index from './pages/Index';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
