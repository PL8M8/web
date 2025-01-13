import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '@components/Navbar';
import { supabase } from '@utils/supabase';

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

const SwitchButton = styled.button`
  margin-top: 20px;
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    color: darkblue;
  }
`;

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    if (isSigningUp) {
      // Sign up logic
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/welcome` },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Sign-up successful! Check your email for confirmation.');
      }
    } else {
      // Sign in logic
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Sign-in successful! Redirecting...');
        // Redirect or perform further actions here
      }
    }
  };

  return (
    <div className="page">
      <div className="background" />
      <Navbar />
      <main className="main-content">
        <ContentWrapper>
          <FormWrapper>
            <h1 style={{ textAlign: 'center', width: '100%' }}>
              {isSigningUp ? 'Sign Up' : 'Sign In'}
            </h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleAuth}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit">{isSigningUp ? 'Sign Up' : 'Sign In'}</Button>
            </form>
            <SwitchButton onClick={() => setIsSigningUp(!isSigningUp)}>
              {isSigningUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </SwitchButton>
          </FormWrapper>
        </ContentWrapper>
      </main>
    </div>
  );
}
