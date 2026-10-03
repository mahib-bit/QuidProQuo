import React, { useContext } from 'react';

import { Navigate } from 'react-router';

import { AuthContext } from '../context/AuthContext';

//=========================Private Route=========================

const PrivateRoute = ({ children }) => {

    const { user, loading } = useContext(AuthContext);

    // Firebase is still checking authentication
    if (loading) {

        return <p>Loading...</p>;

    }

    // User is not authenticated
    if (!user) {

        return <Navigate to="/login" />;

    }

    // User is authenticated
    return children;

};

export default PrivateRoute;