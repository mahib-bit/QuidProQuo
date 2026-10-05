import React, {
    createContext,
    useEffect,
    useState
} from 'react';

import {
    onAuthStateChanged
} from 'firebase/auth';

import { auth } from '../firebase/firebase';

import { authenticatedFetch } from '../api/api';

//=========================Auth Context=========================

export const AuthContext = createContext(null);

//=========================Auth Provider=========================

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [mongoUser, setMongoUser] = useState(null);

    const [loading, setLoading] = useState(true);

    //=========================Authentication State=========================

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            async (currentUser) => {

                setUser(currentUser);

                //=========================No Firebase User=========================

                if (!currentUser) {

                    setMongoUser(null);

                    setLoading(false);

                    return;

                }

                //=========================Get MongoDB User=========================

                try {

                    setLoading(true);

                    const response = await authenticatedFetch(
                        currentUser,
                        '/users/me'
                    );

                    if (!response.ok) {

                        throw new Error(
                            'Failed to fetch MongoDB user'
                        );

                    }

                    const data = await response.json();

                    setMongoUser(data);

                } catch (error) {

                    console.error(
                        'Failed to fetch MongoDB user:',
                        error
                    );

                    setMongoUser(null);

                } finally {

                    setLoading(false);

                }

            }
        );

        return () => {

            unsubscribe();

        };

    }, []);

    //=========================Auth Context=========================

    return (

        <AuthContext.Provider
            value={{
                user,
                mongoUser,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export default AuthProvider;