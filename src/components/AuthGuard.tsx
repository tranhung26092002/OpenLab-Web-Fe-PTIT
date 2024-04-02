import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, settings } from '../util/config';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const token = settings.getStore(ACCESS_TOKEN);
    if (!token) {
        // Nếu không có token, chuyển hướng đến trang login
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default AuthGuard;
