import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
