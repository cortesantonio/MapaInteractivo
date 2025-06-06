import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PropagateLoader } from 'react-spinners';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { session, userRole, authLoading } = useAuth();

    if (authLoading) {
        return <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', textAlign: 'center',
            flexDirection: 'column'
        }}>
            <PropagateLoader
                color='#29482a' size={40}
            />

            <p style={{ color: '#29482a', fontSize: '1.2rem', marginTop: '50px', paddingLeft: '50px' }}>Cargando...</p>
        </div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole || '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
