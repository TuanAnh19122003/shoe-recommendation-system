import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from './components/layouts/user/userLayout';
import AdminLayout from './components/layouts/admin/adminLayout';

import NotFound from './pages/NotFound';
import Home from './pages/user/Home';

import Dashboard from './pages/admin/Dashboard';
import RolePage from './pages/admin/role/RolePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === ROUTES USER === */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* === ROUTES ADMIN === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='roles' element={<RolePage />} />
        </Route>

        {/* 404 & Redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;