import React, {
    createContext,
    useEffect,
    useState
} from 'react';

import {
    onAuthStateChanged
} from 'firebase/auth';

import { auth } from '../firebase/firebase';

//=========================Auth Context=========================

export const AuthContext = createContext(null);

//=========================Auth Provider=========================

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {

            setUser(currentUser);
            setLoading(false);

        }
    );

    return () => {
        unsubscribe();
    };

}, []);
    return (
        <AuthContext.Provider value={{ user , loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;