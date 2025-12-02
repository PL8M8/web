import React from 'react';
import styled from 'styled-components';
import colors from 'constants/colors';

const StyledButton = styled.button`
    border: 2px solid ${colors.primary};
    border-radius: 5px;
    color: ${colors.primary};
    font-weight: bold;
    text-transform: uppercase;
    background: none;
    cursor: pointer;
    padding: 8px 16px;
    width: auto;
    min-width: 150px;
    transition: background-color 0.3s, color 0.3s, transform 0.1s;

    &:hover {
        background-color: ${colors.primary};
        color: white;
    }

    &:active {
        transform: scale(0.95);
    }
`;

export default function Button({ value, onClick }) {
    return (
        <StyledButton onClick={onClick}>{value}</StyledButton>
    );
}
