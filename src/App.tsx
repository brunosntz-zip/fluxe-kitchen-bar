import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import MenuManagement from "@/pages/admin/MenuManagement";
import TableManagement from "@/pages/admin/TableManagement";
import KDS from "@/pages/KDS";
import NotFound from "@/pages/NotFound";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["manager"]}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="tables" element={<TableManagement />} />
            </Route>
            <Route path="/kds" element={<ProtectedRoute allowedRoles={["manager", "kitchen", "bar"]}><KDS /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  </>
);

export default App;
