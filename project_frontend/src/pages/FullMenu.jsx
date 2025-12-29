import React from 'react';
import Navbar from '../componets/Navbar';
import Footer from '../componets/Footer';
import Menu from './Menu';
import PageTransition from '../componets/PageTransition';


const FullMenu = () => {
  return (
    <PageTransition>
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      <div className="pt-24">
        {/* Pass isPreview={false} explicitly, or let it default */}
        <Menu isPreview={false} />
      </div>
      <Footer />
    </main>
    </PageTransition>
  );
};

export default FullMenu;