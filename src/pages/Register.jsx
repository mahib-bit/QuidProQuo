import React, { useState } from 'react';

import {
    createUserWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '../firebase/firebase';


//=========================Register Component=========================

const Register = () => {

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');


    //=========================Handle Register=========================

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const token = await result.user.getIdToken();

            console.log('Token:', token);
            console.log('Sending request to:', 'http://localhost:3000/users');

            const response = await fetch('http://localhost:3000/users', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({

                    name: name,
                    email: result.user.email,
                    photo: result.user.photoURL || ''

                })

            });

            if (!response.ok) {

                throw new Error('Failed to create MongoDB user');

            }

            const data = await response.json();

            console.log('MongoDB User:', data);

        } catch (error) {

            console.error('Registration failed:', error);

        }

    };


    return (

        <div>

            <h1>Quid Pro Quo</h1>

            <h2>Sign Up</h2>

            <form onSubmit={handleRegister}>

                <div>

                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />

                </div>


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
                    Register
                </button>

            </form>

        </div>

    );

};


export default Register;