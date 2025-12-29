import React from 'react';
import Navbar from '../componets/Navbar';
import Footer from '../componets/Footer';
import FAQ from './FAQs';
import PageTransition from '../componets/PageTransition';

const FullFAQ = () => {
  return (
    <PageTransition>
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      <div className="pt-24">
        <FAQ isPreview={false} />
      </div>
      <Footer />
    </main>
    </PageTransition>
  );
};

export default FullFAQ;