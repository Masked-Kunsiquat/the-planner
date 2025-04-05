// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripPage';
import ExpensesPage from './pages/ExpensesPage';
import { Layout } from './components/Layout';

const AppWrapper: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppWrapper />}>
          <Route index element={<Dashboard />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;