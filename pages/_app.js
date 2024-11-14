import Head from 'next/head';
import Script from 'next/script'
import '@styles/home.css'
import '@styles/contact.css'
import '@styles/globals.css'

function Application({ Component, pageProps }) {
  return (
  <>
    <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
        <Script>{`
          (function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:${process.env.HOTJAR_ID},hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv='); 
        `}</Script>
    </Head>
    <Component {...pageProps} />
  </>)
}

export default Application
