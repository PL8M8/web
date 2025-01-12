import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border: 1px  solid orange;
    color: orange;
    font-weight: bold;
    text-transform: uppercase;
    background: none;
    cursor: pointer;
    padding: 8px 16px;
    width: auto;
    min-width: 150px;
    height: 100%; /* Ensures the button spans the full height of its container */
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
        <div style={{ height: '100px' }}> {/* Example height for the container */}
            <StyledButton onClick={onClick}>{value}</StyledButton>
        </div>
    );
}
