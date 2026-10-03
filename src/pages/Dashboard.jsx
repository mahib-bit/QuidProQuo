import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';

//=========================Dashboard Component=========================

const Dashboard = () => {
    const handleLogout = async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error('Logout failed:', error);

        }

    };
    const { user } = useContext(AuthContext);

    return (
        <div>

            <h1>Quid Pro Quo Dashboard</h1>

            <p>
                Welcome, {user.email}
            </p>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;