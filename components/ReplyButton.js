import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@components/Button';
import colors from '@constants/colors';
import { supabase } from 'config/supabase';

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 500px;
  max-width: 90vw;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #222;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SectionContainer = styled.div`
  padding: 16px;
  border-bottom: ${props => props.$hasBottomBorder ? '1px solid #eaeaea' : 'none'};
`;

const SectionTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
`;

const ContactOption = styled.div`
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ContactLink = styled.a`
  text-decoration: none;
  color: #444;
  display: block;
  font-size: 16px;
`;

const LoginMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
`;

const LoginButton = styled.button`
  margin-top: 16px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

// New messaging modal styles
const MessageForm = styled.form`
  padding: 20px;
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const MessageActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  
  ${props => props.primary ? `
    background-color: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
    
    &:hover:not(:disabled) {
      background-color: #5a6268;
    }
    
    &:disabled {
      background-color: #e9ecef;
      color: #6c757d;
      border-color: #e9ecef;
      cursor: not-allowed;
    }
  ` : `
    background-color: white;
    color: #666;
    border-color: #ddd;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #adb5bd;
    }
  `}
`;

const CharacterCount = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #155724;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
`;

export default function ReplyButton({ 
  contactEmail, 
  contactPhone, 
  listingTitle, 
  listingUrl,
  vehicleId,  // Add vehicleId prop for forum reports
  onLoginClick
}) {
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const modalRef = useRef(null);
  const messageModalRef = useRef(null);
  
  const maxMessageLength = 500;
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(session && session.user ? true : false);
          if (session && session.user) {
            setCurrentUserId(session.user.id);
          }
        }
      } catch (err) {
        console.error('Unexpected error checking auth status:', err);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Default fallback values
  const email = contactEmail || "info@pl8m8.co";
  const phone = contactPhone || "404-980-1188";
  const title = listingTitle || "Listing Inquiry";
  
  // Get the current page URL if not provided
  const currentUrl = listingUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Create email subject and body
  const emailSubject = encodeURIComponent(title);
  const emailBody = encodeURIComponent(`\n\n\n\n--\nListing URL: ${currentUrl}`);
  
  const toggleModal = () => {
    if (isLoggedIn) {
      // If logged in, go directly to message modal
      setShowMessageModal(!showMessageModal);
      setMessage('');
      setSubmitError('');
      setSubmitSuccess('');
    } else {
      // If not logged in, show login modal
      setShowModal(!showModal);
      setSubmitError('');
      setSubmitSuccess('');
    }
  };

  const toggleMessageModal = () => {
    setShowMessageModal(!showMessageModal);
    setMessage('');
    setSubmitError('');
    setSubmitSuccess('');
  };

  // Handle click outside to close modal
  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  const handleMessageOverlayClick = (event) => {
    if (messageModalRef.current && !messageModalRef.current.contains(event.target)) {
      setShowMessageModal(false);
    }
  };

  const handleLoginClick = () => {
    setShowModal(false);
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxMessageLength) {
      setMessage(value);
      setSubmitError('');
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setSubmitError('Please enter a message');
      return;
    }

    if (!vehicleId) {
      setSubmitError('Vehicle information not available');
      return;
    }

    if (!currentUserId) {
      setSubmitError('User authentication required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          vehicle_id: vehicleId,
          user_id: currentUserId,
          type: 'forum',
          description: message.trim(),
          status: 'open',
          severity: 'low'
        }]);

      if (error) {
        throw error;
      }

      setSubmitSuccess('Message posted successfully!');
      setMessage('');
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowMessageModal(false);
        setSubmitSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError('Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={toggleModal}
        value={isCheckingAuth ? "Loading..." : "Send A Message"}
        style={{ backgroundColor: colors.primary }}
        disabled={isCheckingAuth}
      />
      <Container>      
        {/* Login Modal - Only for non-logged-in users */}
        {showModal && !isLoggedIn && (
          <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer ref={modalRef}>
              <ModalHeader>
                <ModalTitle>Login Required</ModalTitle>
                <CloseButton onClick={toggleModal}>&times;</CloseButton>
              </ModalHeader>
              
              <LoginMessage>
                Please login to find out more about this listing and contact the seller.
                <LoginButton onClick={handleLoginClick}>
                  Login
                </LoginButton>
              </LoginMessage>
            </ModalContainer>
          </ModalOverlay>
        )}

        {/* Message Modal - For logged-in users */}
        {showMessageModal && isLoggedIn && (
          <ModalOverlay onClick={handleMessageOverlayClick}>
            <ModalContainer ref={messageModalRef}>
              <ModalHeader>
                <ModalTitle>Post a Message</ModalTitle>
                <CloseButton onClick={toggleMessageModal}>&times;</CloseButton>
              </ModalHeader>
              
              <MessageForm onSubmit={handleSubmitMessage}>
                <div style={{ marginBottom: '12px', color: '#666', fontSize: '14px' }}>
                  Share your thoughts, questions, or experiences about this vehicle.
                </div>
                
                <MessageInput
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Enter your message here... (e.g., 'Great vehicle! Had one just like it', 'Any maintenance issues?', 'Still available?')"
                  disabled={isSubmitting}
                />
                
                <CharacterCount>
                  {message.length}/{maxMessageLength} characters
                </CharacterCount>
                
                {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                {submitSuccess && <SuccessMessage>{submitSuccess}</SuccessMessage>}
                
                <MessageActions>
                  <ActionButton 
                    type="button" 
                    onClick={toggleMessageModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton 
                    type="submit" 
                    primary 
                    disabled={isSubmitting || !message.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Message'}
                  </ActionButton>
                </MessageActions>
              </MessageForm>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
    </>
  );
}