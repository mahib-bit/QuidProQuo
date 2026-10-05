import React, {useContext} from 'react';
import {signOut} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';

//=========================Dashboard Component=========================

const Dashboard = () => {

    const {user,mongoUser,loading} = useContext(AuthContext);

    //=========================Handle Logout=========================

    const handleLogout = async () => {

        try {

            await signOut(auth);

            console.log('Logged out successfully');

        } catch (error) {

            console.error('Logout failed:', error);

        }

    };

    //=========================Loading=========================

    if (loading) {

        return <p>Loading user...</p>;

    }

    //=========================Dashboard=========================

    return (

        <div>

            <h1>Dashboard</h1>

            <p>
                Logged in as: {user.email}
            </p>

            <h2>Profile</h2>

            {mongoUser && (

                <div>

                    <p>
                        <strong>Name:</strong> {mongoUser.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {mongoUser.email}
                    </p>

                    <p>
                        <strong>Firebase UID:</strong> {mongoUser.firebaseUid}
                    </p>

                </div>

            )}

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>

    );

};

export default Dashboard;