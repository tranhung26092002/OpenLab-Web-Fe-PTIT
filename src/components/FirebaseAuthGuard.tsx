import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, settings } from '../util/config';

interface FirebaseAuthGuardProps {
    children: ReactNode;
}

const FirebaseAuthGuard: React.FC<FirebaseAuthGuardProps> = ({ children }) => {
    const token = settings.getStore(ACCESS_TOKEN);

    if (!token) {

        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default FirebaseAuthGuard;
