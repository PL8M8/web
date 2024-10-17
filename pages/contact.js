import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for sending
    const formData = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFeedback('Message received!'); // Set success message
        // Reset form fields
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setFeedback('Something went wrong. Please try again.');
      }
    } catch (error) {
      setFeedback('An error occurred. Please try again.');
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
      {feedback && <div className="toast">{feedback}</div>}
      
      <style jsx>{`
        .contact-page {
          padding: 20px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .toast {
          margin-top: 10px;
          color: white;
          background-color: green;
          padding: 10px;
          border-radius: 5px;
          transition: opacity 0.5s;
        }
      `}</style>
    </div>
  );
}
