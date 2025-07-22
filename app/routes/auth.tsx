import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'ResumAlyze | Auth' },
    { name: 'description', content: 'Log into your account' },
]);

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
                <h2 className="text-lg text-gray-600 mt-2 mb-8">Log in to continue your job journey</h2>

                {isLoading ? (
                    <button className="w-full py-3 bg-gray-300 rounded-md text-gray-700 font-semibold animate-pulse">
                        Signing you in...
                    </button>
                ) : auth.isAuthenticated ? (
                    <button
                        className="w-full py-3 bg-red-500 hover:bg-red-600 transition-colors rounded-md text-white font-semibold"
                        onClick={auth.signOut}
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md text-white font-semibold"
                        onClick={auth.signIn}
                    >
                        Log In
                    </button>
                )}
            </div>
        </main>
    );
};

export default Auth;
