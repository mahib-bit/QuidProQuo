import React, { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

import { authenticatedFetch } from '../api/api';

//=========================Dashboard Component=========================

const Dashboard = () => {

    const { user } = useContext(AuthContext);

    const handleTestBackend = async () => {

        try {

            const response = await authenticatedFetch(
                user,
                '/protected'
            );

            const data = await response.json();

            console.log('Backend Response:', data);

        } catch (error) {

            console.error('Backend request failed:', error);

        }

    };

    return (

        <div>

            <h1>Dashboard</h1>

            <p>Logged in as: {user.email}</p>

            <button onClick={handleTestBackend}>
                Test Backend
            </button>

        </div>

    );

};

export default Dashboard;