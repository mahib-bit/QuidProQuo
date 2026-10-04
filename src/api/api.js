//=========================API Configuration=========================

const API_URL = 'http://localhost:3000';

//=========================Authenticated Request=========================

export const authenticatedFetch = async (user, endpoint, options = {}) => {

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}${endpoint}`, {

        ...options,

        headers: {

            ...options.headers,

            'Authorization': `Bearer ${token}`

        }

    });

    return response;

};