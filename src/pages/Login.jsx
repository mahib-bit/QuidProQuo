import React, { useState } from 'react';

import {
    signInWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '../firebase/firebase';

//=========================Login Component=========================

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //=========================Handle Login=========================

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log('Login successful:', result.user.email);

        } catch (error) {

            console.error('Login failed:', error);

        }

    };

    return (
        <div>

            <h1>Quid Pro Quo</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                </div>

                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                </div>

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );

};

export default Login;