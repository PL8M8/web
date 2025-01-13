import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '@components/Navbar';
import { supabase } from '../utils/supabase';

const Mosaic = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr); // Limit to 5 columns on desktop
    }
`;

const Card = styled.div`
    background: white;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: transl