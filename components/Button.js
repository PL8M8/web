import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border-radius: 5px;
    border: 2px solid orange;
    color: orange;
    font-weight: bold;
    text-transform: uppercase;
    background: none;
    cursor: pointer;git 
    padding: 8px 16px;
    transition: background-color 0.3s, color 0.3s, transform 0.1s;

    &:hover {
        background-color: orange;
        color: white;
    }

    &:active {
        transform: scale(0.95); /* Scale down slightly on click */
    }
`;

export default function Button({ value, onClick }) {
    return (
        <div style={{ margin: '4px' }}>
            <StyledButton onClick={onClick}>{value}</StyledButton>
        </div>
    );
}
