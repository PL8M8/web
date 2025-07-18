import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Main = styled.main`
    background-color: #FCEFCB;
    min-height: 100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
`;

const NavbarContainer = styled.nav`
    display: flex;
    align-items: center;
    padding-right: 20px;
    padding-top: 4px;
    flex-wrap: nowrap; 
    width: 100%; 
    height: 50px;
    box-sizing: border-box;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #FCEFCB;
`;

const SignInButtonContainer = styled.div`
    margin-left: auto;
    padding-right: 20px;
`;

const GoBackButtonContainer = styled.div`
    margin-right: auto;
    padding-left: 20px;
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const LogoImage = styled.img`
    width: 240px;
    height: 120px;
    object-fit: contain;
`;

const Tagline = styled.div`
    font-size: 2rem;
    max-width: 700px;
    line-height: 1.4;
    color: #4E1F00;
    margin-top: 2rem;
`;

const Button = styled.button`
    background-color: #4E1F00;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #3a1700;
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
    
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-end;
    }
`;

const TextInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: white;
    color: #333;
    
    &:focus {
        border-color: #4E1F00;
        outline: none;
        box-shadow: 0 0 0 3px rgba(78, 31, 0, 0.1);
    }
    
    &::placeholder {
        color: #999;
    }
`;

const ErrorMessage = styled.div`
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #f5c6cb;
    text-align: center;
    font-size: 1rem;
    margin-top: 1rem;
    max-width: 500px;
    width: 100%;
`;

const Disclaimer = styled.div`
    font-size: 0.75rem;
    color: #4E1F00;
    text-align: center;
    max-width: 400px;
    margin-top: 0.5rem;
`;

const BrevoFormWrapper = styled.div`
    width: 100%;
    max-width: 500px;
    
    #sib-container {
        background-color: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        box-shadow: none !important;
    }
    
    .sib-form-block p {
        display: none !important;
    }
    
    .sib-input input {
        width: 100% !important;
        padding: 0.75rem 1rem !important;
        border: 2px solid #ddd !important;
        border-radius: 0.5rem !important;
        font-size: 1rem !important;
        background-color: white !important;
        color: #333 !important;
        
        &:focus {
            border-color: #4E1F00 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(78, 31, 0, 0.1) !important;
        }
        
        &::placeholder {
            color: #999 !important;
            text-align: left !important;
        }
    }
    
    .sib-form-block__button {
        width: 100% !important;
        padding: 0.75rem 1rem !important;
        background-color: #4E1F00 !important;
        color: white !important;
        border: none !important;
        border-radius: 0.5rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important;
        
        &:hover {
            background-color: #3a1700 !important;
        }
        
        &:disabled {
            background-color: #ccc !important;
            cursor: not-allowed !important;
        }
    }
    
    .sib-form {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
        width: 100% !important;
        
        @media (min-width: 768px) {
            flex-direction: row !important;
            align-items: flex-end !important;
        }
    }
    
    .sib-input {
        flex: 1 !important;
    }
    
    .sib-form-block:has(.sib-form-block__button) {
        flex-shrink: 0 !important;
    }
    
    .entry__specification {
        font-size: 0.75rem !important;
        color: #4E1F00 !important;
        text-align: left !important;
        max-width: 400px !important;
        margin-top: 0.5rem !important;
    }
    
    .sib-form-message-panel {
        padding: 1rem !important;
        border-radius: 0.5rem !important;
        text-align: center !important;
        font-size: 1rem !important;
        margin-top: 1rem !important;
        max-width: 500px !important;
        width: 100% !important;
    }
    
    #success-message {
        background-color: #d4edda !important;
        color: #155724 !important;
        border: 1px solid #c3e6cb !important;
    }
    
    #error-message {
        background-color: #f8d7da !important;
        color: #721c24 !important;
        border: 1px solid #f5c6cb !important;
    }
    
    .sib-icon {
        display: none !important;
    }
`;

const Footer = styled.footer`
    padding: 2rem;
    border-top: 1px solid #eee;
    background-color: #4E1F00;
    color: white;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #666;
    margin: 2rem 0 1rem 0;
`;

const Copyright = styled.div`
    font-size: 0.875rem;
    color: #ccc;
    text-align: center;
`;

const SuccessMessage = styled.div`
    background-color: #d4edda;
    color: #155724;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #c3e6cb;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    animation: slideIn 0.5s ease-out;
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export default function Index() {
    const router = useRouter();
    const betaPassword = "pl8m8-beta-2025";
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [onPasswordPage, setOnPasswordPage] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [coolMessage, setCoolMessage] = useState('');

    useEffect(() => {
        setIsMounted(true);
        if (localStorage.getItem('bypassPassword')){
            router.replace('/listings');
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            const tracking = {
                source: router.query.source,
                campaign: router.query.campaign,
                location: router.query.location,
                qr_code: router.query.qr_code,
                shop: router.query.shop,
                station: router.query.station,
                event: router.query.event,
                utm_source: router.query.utm_source,
                utm_medium: router.query.utm_medium,
                utm_campaign: router.query.utm_campaign,
                utm_content: router.query.utm_content
            };

            const form = document.getElementById('sib-form');
            if (form) {
                Object.entries(tracking).forEach(([key, value]) => {
                    if (value) {
                        const existingInput = form.querySelector(`input[name="${key}"]`);
                        if (!existingInput) {
                            const input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = key;
                            input.value = value;
                            form.appendChild(input);
                        }
                    }
                });

                const checkForBrevoAndOverride = () => {
                    const form = document.getElementById('sib-form');
                    if (form && !form.hasAttribute('data-override-complete')) {
                        form.setAttribute('data-override-complete', 'true');
                        
                        const newForm = form.cloneNode(true);
                        form.parentNode.replaceChild(newForm, form);
                        
                        newForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const formData = new FormData(newForm);
                            const email = formData.get('EMAIL');
                            
                            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                                return;
                            }

                            fetch(newForm.action, {
                                method: 'POST',
                                body: formData,
                                mode: 'no-cors'
                            }).then(() => {
                                const coolMessages = [
                                    "🎉 Welcome to the PL8M8 family! You're now in the driver's seat for early access!",
                                    "🚗 Buckle up! You're officially on the VIP list for the future of car buying!",
                                    "🏁 You're in! Get ready to revolutionize how you buy and sell cars!",
                                    "⚡ Amazing! You're now part of the car marketplace revolution!",
                                    "🔥 You're locked and loaded for early access! The car buying game just changed!",
                                    "🎯 Direct hit! You're now in our exclusive launch crew!",
                                    "🚀 Mission accomplished! You're aboard the PL8M8 spaceship to better car deals!",
                                    "💎 You're now a founding member of the transparent car buying movement!",
                                    "🏆 Victory! You've secured your spot in the future of automotive!",
                                    "⭐ Stellar! You're now part of our exclusive early access constellation!"
                                ];
                                
                                const randomMessage = coolMessages[Math.floor(Math.random() * coolMessages.length)];
                                setCoolMessage(randomMessage);
                                setIsSubmitted(true);
                            }).catch(error => {
                                console.error('Error:', error);
                                const randomMessage = "🎉 Welcome to the PL8M8 family! You're now in the driver's seat for early access!";
                                setCoolMessage(randomMessage);
                                setIsSubmitted(true);
                            });
                        });
                    }
                };

                checkForBrevoAndOverride();
                const interval = setInterval(checkForBrevoAndOverride, 500);
                setTimeout(() => clearInterval(interval), 10000);
            }
        }
    }, [isMounted, router.query]);

    const togglePasswordPage = () => {
        setOnPasswordPage(!onPasswordPage);
    };

    const handlePasswordSubmit = () => {
        if (password === betaPassword) {
            localStorage.setItem('bypassPassword', true)
            setIncorrectPassword(false);
            router.replace('/listings');
        } else {
            setIncorrectPassword(true);
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <MainWrapper>
            <style jsx>{`
                @font-face {
                    font-display: block;
                    font-family: Roboto;
                    src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
                }

                @font-face {
                    font-display: fallback;
                    font-family: Roboto;
                    font-weight: 600;
                    src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
                }

                @font-face {
                    font-display: fallback;
                    font-family: Roboto;
                    font-weight: 700;
                    src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
                }

                #sib-container input:-ms-input-placeholder {
                    text-align: left;
                    font-family: inherit;
                    color: #999;
                }

                #sib-container input::placeholder {
                    text-align: left;
                    font-family: inherit;
                    color: #999;
                }

                #sib-container textarea::placeholder {
                    text-align: left;
                    font-family: inherit;
                    color: #999;
                }

                #sib-container a {
                    text-decoration: underline;
                    color: #4E1F00;
                }
            `}</style>
            
            <Main>
                {!onPasswordPage ? (
                    <>
                        <NavbarContainer>
                            <SignInButtonContainer>
                                <Button onClick={togglePasswordPage}>
                                    BETA
                                </Button>                    
                            </SignInButtonContainer>
                        </NavbarContainer>
                        <LogoContainer>
                            <LogoImage src="/logo.png" alt="PL8M8 Logo" />
                        </LogoContainer>
                        <Tagline>Where car maintenance meets community. Real people, real deals, real transparency.</Tagline>
                        
                        {!isSubmitted ? (
                            <BrevoFormWrapper>
                                <div className="sib-form" style={{textAlign: 'center'}}>
                                    <div id="sib-form-container" className="sib-form-container">
                                        <div id="error-message" className="sib-form-message-panel" style={{display: 'none'}}>
                                            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                                                <span className="sib-form-message-panel__inner-text">
                                                    Your submission could not be saved. Please try again.
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div id="success-message" className="sib-form-message-panel" style={{display: 'none'}}>
                                            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                                                <span className="sib-form-message-panel__inner-text">
                                                    🎉 Welcome to the waitlist! You'll be among the first to know when PL8M8 launches. Keep an eye on your inbox!
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div id="sib-container" className="sib-container--large sib-container--vertical">
                                            <form id="sib-form" method="POST" action="https://e83a7e5d.sibforms.com/serve/MUIFAJQR4k_wUWA9rHI1j7IlmdbZYtJJuGpD-8ZsYJlL7xfLi_xJYEaN50iYceddNIOm-9WxxYXOUlLaJoJTZxRTxANjOADFP7CPksqgXAbx201u7US3Aif1UAbERpJyK-PYuQ1dM6Et-fbzzEhQzdXQljUasRs3aC9M5ZrSgT9Mj96GTGC99psndvr7Mhq-WTh1jeR-NdOEaDk9" data-type="subscription">
                                                
                                                <div style={{padding: '8px 0'}}>
                                                    <div className="sib-input sib-form-block">
                                                        <div className="form__entry entry_block">
                                                            <div className="form__label-row">
                                                                <div className="entry__field">
                                                                    <input 
                                                                        className="input" 
                                                                        type="text" 
                                                                        id="EMAIL" 
                                                                        name="EMAIL" 
                                                                        autoComplete="off" 
                                                                        placeholder="Enter your email" 
                                                                        data-required="true" 
                                                                        required 
                                                                    />
                                                                </div>
                                                            </div>
                                                            <label className="entry__error entry__error--primary" style={{display: 'none'}}></label>
                                                            <label className="entry__specification">
                                                                By submitting my personal data I agree to receive marketing emails from PL8M8
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div style={{padding: '8px 0'}}>
                                                    <div className="sib-form-block" style={{textAlign: 'center'}}>
                                                        <button 
                                                            className="sib-form-block__button sib-form-block__button-with-loader" 
                                                            form="sib-form" 
                                                            type="submit"
                                                        >
                                                            JOIN WAITLIST
                                                        </button>
                                                    </div>
                                                </div>

                                                <input type="text" name="email_address_check" value="" className="input--hidden" style={{display: 'none'}} />
                                                <input type="hidden" name="locale" value="en" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </BrevoFormWrapper>
                        ) : (
                            <SuccessMessage>
                                {coolMessage}
                            </SuccessMessage>
                        )}
                    </>
                ) : (
                    <>
                        <NavbarContainer>
                            <GoBackButtonContainer>
                                <Button onClick={togglePasswordPage}>
                                    Go Back
                                </Button>                    
                            </GoBackButtonContainer>
                        </NavbarContainer>
                        <LogoContainer>
                            <LogoImage src="/logo.png" alt="PL8M8 Logo" />
                        </LogoContainer>
                        <Tagline>Thanks for helping us test! Enter your password to get started</Tagline>
                        <InputSection>
                            <TextInput 
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button 
                                onClick={handlePasswordSubmit}
                                disabled={!password}
                            >
                                Enter
                            </Button>
                        </InputSection>

                        {incorrectPassword && (
                            <ErrorMessage>
                                Incorrect Password
                            </ErrorMessage>
                        )}
                    </>
                )}
            </Main>
            
            <Footer>
                <Divider />
                <Copyright>© {new Date().getFullYear()} PL8M8 LLC. All rights reserved.</Copyright>
            </Footer>
            
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
                        window.LOCALE = 'en';
                        window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
                        window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
                        window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
                        window.translation = {
                            common: {
                                selectedList: '{quantity} list selected',
                                selectedLists: '{quantity} lists selected',
                                selectedOption: '{quantity} selected',
                                selectedOptions: '{quantity} selected',
                            }
                        };
                        var AUTOHIDE = Boolean(0);
                    `
                }}
            />
            <script defer src="https://sibforms.com/forms/end-form/build/main.js"></script>
        </MainWrapper>
    );
}