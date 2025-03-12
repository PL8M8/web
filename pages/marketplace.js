import Navbar from '@components/Navbar';
import VehicleFeed from '@components/VehicleFeed';
import React from 'react';

const Marketplace = () => {
    return (
        <div>
            <Navbar />
            <div className='background'/>
            <VehicleFeed/>
        </div>
    )
};

export default Marketplace;
