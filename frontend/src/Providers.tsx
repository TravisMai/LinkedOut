import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const client = new QueryClient();
const clientId = "752296882896-v5jdk0s8o99bqtgqi72tjnaetfskd5cc.apps.googleusercontent.com" //import.meta.env.VITE_REACT_GOOGLE_CLIENT_ID

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={client}>
            <GoogleOAuthProvider clientId={clientId}
            >
                {children}
            </GoogleOAuthProvider>
        </QueryClientProvider>
    )
}

export default Providers