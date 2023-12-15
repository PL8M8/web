import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <Head>
        <title>PL8M8 Experiment - Shape the Future</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to the PL8M8 Experiment!" />

        {/* Button to Open Google Forms */}
        <div style={{ marginTop: '16px' }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSea4PmCTcMu_2B2kc_hjDZD6iEDgbybYMpzOjO-bPzp0YTliA/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#ff8800',
              color: '#fff',
              textDecoration: 'none',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Take the Survey
          </a>
        </div>

        {/* Card Style */}
        <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
          <p style={{ color: '#333', fontWeight: 'bold' }}>
            Join the PL8M8 Experience! Share your insights in our survey and contribute to positive change.
          </p>

          <p style={{ marginTop: '16px', color: '#666' }}>
            Embark on a transformative journey with us by participating in our exclusive survey. Your valuable insights will serve as the foundation for crafting impactful solutions to address the challenges you face. By taking part, you actively influence the direction of our efforts, ensuring that your needs and concerns are not only heard but directly translated into actionable solutions. We're committed to leveraging the survey results to inform strategic decisions, implement user-centric improvements, and tackle issues head-on. Join us in this collaborative effort to shape the future, where your voice is not only acknowledged but serves as the catalyst for positive change. Thank you for being an essential part of our community; together, we'll build a better tomorrow based on the insights we gather today!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
