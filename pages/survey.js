import React from 'react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 75vh;
`;

const FormWrapper = styled.div`
    padding: 40px;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: orange;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: darkorange;
  }
`;


export default function SignInPage() {
    return (
        <div className="page">
            <div className="background" />
            <main className="main-content">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSea4PmCTcMu_2B2kc_hjDZD6iEDgbybYMpzOjO-bPzp0YTliA/viewform?embedded=true" width="640" height="4854" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
            </main>
        </div>
    );
}