import posthog from "posthog-js";
import { PostHogProvider } from 'posthog-js/react';
import Head from 'next/head';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import '@styles/home.css';
import '@styles/contact.css';
import '@styles/globals.css';
import '@styles/showcase.css';
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

function Application({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    posthog.capture('my event', { property: 'pl8m8 test value' });

    if (process.env.NEXT_PUBLIC_HOTJAR_ID) {
      (function (h, o, t, j, a, r) {
        h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
        h._hjSettings = { hjid: process.env.NEXT_PUBLIC_HOTJAR_ID, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, []);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
      </Head>
      <PostHogProvider client={posthog}>
        <Navbar />
        <div className="background" />
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </PostHogProvider>
    </>
  );
}

export default Application;