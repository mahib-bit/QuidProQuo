import React from 'react';

import {Outlet} from 'react-router';
import Navbar from '../components/Navbar';


//=========================Root Component=========================

const Root = () => {

    return (
        <div>
            <Navbar></Navbar>
            <Outlet />

        </div>
    );

};

export default Root;