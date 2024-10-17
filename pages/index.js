import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as necessary

export default function Index() {
    return (
        <div className="page">
            <div className="background" />
            <Navbar />
            <main className="main-content">
                <section>
                    <div className="intro">
                        <div>
                            <img className="intro-logo" src="/logo.png" alt="pl8m8 Logo" />
                        </div>
                        <h1>Your Garage, Simplified.</h1>
                    </div>
                    <div className="description">
                        <p>Keep all your car info in one spot! Easily track mileage, registration, and photos. Plus, enjoy:</p>
                        <ul>
                            <li>Friendly reminders to update your mileage</li>
                            <li>Never forget your tag number or important details</li>
                            <li>Quick access to all your vehicle info</li>
                        </ul>
                        <div className="survey-button">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSea4PmCTcMu_2B2kc_hjDZD6iEDgbybYMpzOjO-bPzp0YTliA/viewform?usp=sf_link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Take the Survey
                            </a>
                        </div>
                    </div>
                </section>
                <section>
                    <img className="screenshot" src="/screenshot.png" alt="app screenshot" />
                </section>
            </main>
        </div>
    );
}
