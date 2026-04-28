import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "receptionist") return <Navigate to="/admin/reception" replace />;
    if (user.role === "kitchen" || user.role === "bar") return <Navigate to="/kds" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
