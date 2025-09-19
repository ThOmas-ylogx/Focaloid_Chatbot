import { Navigate, useLocation } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext'

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthContext()
    const location = useLocation()

    if (isLoading) {
        // Show loading spinner while checking authentication
        return (
            <div className="min-h-screen bg-[#111217] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        )
    }

    if (!isAuthenticated()) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

export default PrivateRoute
