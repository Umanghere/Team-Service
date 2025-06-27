import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/loading/LoadingScreen';
import './App.css';

// Lazy load the modules
const Login = lazy(() => import('./pages/Login/Login'));
const TeamMembers = lazy(() => import('./pages/TeamMembers/TeamMembers'));
const Training = lazy(() => import('./pages/Training/Training'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const WFO = lazy(() => import('./pages/WFO/WFO'));
const RootLayout = lazy(() => import('./pages/Root/Root'));

const App = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/Team-Service-UI/*"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Dashboard />} />
          <Route path="teammembers" element={<TeamMembers />} />
          <Route path="wfo" element={<WFO />} />
          <Route path="training" element={<Training />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;