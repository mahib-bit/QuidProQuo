import React from 'react';

import {
    createBrowserRouter
} from 'react-router';

import Root from '../layouts/Root';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ErrorPage from '../pages/ErrorPage';

import PrivateRoute from './PrivateRoute';
import Items from '../pages/Items';

//=========================Routes=========================

const router = createBrowserRouter([

    {
        path: '/',
        Component: Root,
        errorElement: <ErrorPage />,

        children: [

            {
                index: true,
                Component: Home
            },

            {
                path: 'login',
                Component: Login
            },

            {
                path: 'register',
                Component: Register
            },

            //=========================Private Routes=========================

            {
                Component: PrivateRoute,

                children: [

                    {
                        path: 'dashboard',
                        Component: Dashboard
                    },
                    {
                        path: 'items',
                        Component: Items
                    },
                    
                ]

            }

        ]

    }

]);

export default router;