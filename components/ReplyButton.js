import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@components/Button';
import colors from '@constants/colors';

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

// Overlay that covers the entire screen
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

// Modal container centered on the page
const ModalContainer = styled.div`
  width: 320px;
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

export default function ReplyButton({ contactEmail, contactPhone }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  
  // Default fallback values
  const email = contactEmail || "info@pl8m8.co";
  const phone = contactPhone || "404-980-1188";
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  return (
    <Container>
      <Button 
        onClick={toggleModal}
        value="Reply"
        style={{ backgroundColor: colors.primary }}
      />
      
      {showModal && (
        <ModalOverlay>
          <ModalContainer ref={modalRef}>
            <ModalHeader>
              <ModalTitle>Contact Options</ModalTitle>
              <CloseButton onClick={toggleModal}>&times;</CloseButton>
            </ModalHeader>
            
            <SectionContainer $hasBottomBorder={true}>
              <SectionTitle>Email</SectionTitle>
              <ContactOption>
                <ContactLink href={`mailto:${email}`}>
                  {email}
                </ContactLink>
              </ContactOption>
            </SectionContainer>
            
            <SectionContainer>
              <SectionTitle>Call / Text</SectionTitle>
              <ContactOption>
                <ContactLink href={`tel:${phone}`}>
                  {phone}
                </ContactLink>
              </ContactOption>
            </SectionContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
}