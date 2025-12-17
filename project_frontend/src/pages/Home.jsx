import React from 'react';
import Navbar from '../componets/Navbar';
import Hero from '../componets/Hero';
import Features from '../componets/feature';
import MenuSection from './Menu';
import Gallery from '../pages/ArtGallery';
import Franchise from "../pages/Franchise";
import Footer from '../componets/Footer';
const Home = () => {
  return (
    <main className="min-h-screen bg-rabuste-bg text-rabuste-text selection:bg-rabuste-orange selection:text-white">
      <Navbar />
      <Hero />
      <div className="relative z-10 bg-rabuste-bg">
        <Features />
        <MenuSection />
        <Gallery />
        <Franchise />
        <Footer />
      </div>
    </main>
  );
};

export default Home;