import React from 'react';

import {
    Outlet
} from 'react-router';

//=========================Root Component=========================

const Root = () => {

    return (
        <div>

            <Outlet />

        </div>
    );

};

export default Root;