import React from 'react';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import PrivateRoute from './routes/PrivateRoute';

//=========================App Component=========================

const App = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

};

export default App;