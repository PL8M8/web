import Head from 'next/head';
import '@styles/globals.css'
import '@styles/home.css'
import '@styles/contact.css'

function Application({ Component, pageProps }) {
  return (
  <>
    <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
    </Head>
    <Component {...pageProps} />
  </>)
}

export default Application
