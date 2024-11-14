import Head from 'next/head';
import { useEffect } from 'react';
import '@styles/home.css'
import '@styles/contact.css'
import '@styles/globals.css'

function Application({ Component, pageProps }) {

  useEffect(() => {
    // Hotjar Tracking Code
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:process.env.NEXT_PUBLIC_HOTJAR_ID, hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }, []);
  return (
  <>
    <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default Application
