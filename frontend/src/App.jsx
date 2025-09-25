import { Routes, Route, Navigate } from 'react-router-dom'

import ChatContainer from './components/ChatContainer'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import NotFound from './components/NotFound'
import { AuthProvider } from './contexts/AuthContext'

// Layout component for authenticated pages
function AuthenticatedLayout({ children }) {
    
    return (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800 h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-1 flex bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                {children}
            </main>
        </div>
    )
}


function WrapperLayout({ children }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800 h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-1 flex bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                {children}
            </main>
        </div>
    )
}

// --- MAIN APP COMPONENT ---
function App() {
    return (<AuthProvider>
        <Routes>

            {/* Public Route */}
            <Route path="/login" element={
                <WrapperLayout>
                    <LandingPage />
                </WrapperLayout>
            } />

            <Route
                path="/chat"
                element={
                    <AuthenticatedLayout>
                        <ChatContainer />
                    </AuthenticatedLayout>
                }
            />


            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthProvider>)
}

export default App
