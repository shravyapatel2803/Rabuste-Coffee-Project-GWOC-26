import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Franchise from './Franchise';
import PageTransition from '../components/common/PageTransition';


const FullFranchise = () => {
  return (
    <PageTransition>
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text">
      <Navbar />
      <div className="pt-24">
        <Franchise />
      </div>
      <Footer />
    </main>
    </PageTransition>
  );
};

export default FullFranchise;