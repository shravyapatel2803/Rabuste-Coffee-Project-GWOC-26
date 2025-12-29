import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Shop from './Shop';
import PageTransition from '../components/common/PageTransition';


const FullShop = () => {
  return (
    <PageTransition>
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      <div className="pt-24">
        {/* Pass isPreview={false} so it shows everything */}
        <Shop isPreview={false} />
      </div>
      <Footer />
    </main>
    </PageTransition>
  );
};

export default FullShop;