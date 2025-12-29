import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ArtGallery from './ArtGallery';
import PageTransition from '../components/common/PageTransition';


const FullGallery = () => {
  return (
    <PageTransition>
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text selection:bg-rabuste-orange selection:text-white">
      <Navbar />
      {/* Add padding-top so content isn't hidden behind the fixed Navbar */}
      <div className="pt-24">
        {/* We do NOT pass isPreview here, so it shows all items */}
        <ArtGallery />
      </div>
      <Footer />
    </main>
    </PageTransition>
  );
};

export default FullGallery;