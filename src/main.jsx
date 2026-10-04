import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import AuthProvider from './context/AuthContext.jsx';
import { RouterProvider } from 'react-router';
import router from './routes/routes.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>

        <AuthProvider>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>

    </StrictMode>
);