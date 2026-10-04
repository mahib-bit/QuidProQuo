import React, { useContext } from 'react';

import {
    Navigate,
    Outlet
} from 'react-router';

import { AuthContext } from '../context/AuthContext';

//=========================Private Route=========================

const PrivateRoute = () => {

    const { user, loading } = useContext(AuthContext);

    if (loading) {

        return <p>Loading...</p>;

    }

    if (!user) {

        return <Navigate to="/login" />;

    }

    return <Outlet />;

};

export default PrivateRoute;