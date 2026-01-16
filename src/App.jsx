import React from 'react'
import ROTAScheduler from './ROTAScheduler'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import { Loader2 } from 'lucide-react'

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return <ROTAScheduler />;
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App
