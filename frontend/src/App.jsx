import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Assignments from './pages/Assignments';
import DeliveryPersons from './pages/DeliveryPersons';
import Login from './pages/Login';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import HomeRedirect from './routes/HomeRedirect';

const App = () => (
  <Router>
    <Routes>
      {/* Force redirect root "/" to login or dashboard */}
      <Route path="/" element={<HomeRedirect />} />



      {/* Public login page */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      */}
      
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
</Route>

<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Orders />} />
</Route>

      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
        }
       
      >
        <Route index element={<Assignments/>}/>
        </Route>
        <Route
        path="/delivery-persons"
        element={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
        }
       
      >
        <Route index element={<DeliveryPersons/>}/>
        </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
