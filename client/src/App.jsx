import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Placeholder title="Landing" />} />
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/register" element={<Placeholder title="Register" />} />

      {/* Private pages: all share the Layout and need a login */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/materials" element={<Placeholder title="Materials" />} />
        <Route path="/products" element={<Placeholder title="Products" />} />
        <Route path="/products/:id" element={<Placeholder title="Product detail" />} />
        <Route path="/inventory" element={<Placeholder title="Inventory" />} />
        <Route path="/costing" element={<Placeholder title="Costing" />} />
        <Route path="/costing/:id" element={<Placeholder title="Cost breakdown" />} />
        <Route path="/prices" element={<Placeholder title="Price comparison" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="/settings" element={<Placeholder title="Settings" />} />
        <Route path="/help" element={<Placeholder title="Help" />} />
      </Route>

      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}