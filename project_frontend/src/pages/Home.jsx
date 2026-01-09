import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/common/Hero';
import Features from '../components/feature';
import MenuSection from './Menu';
import Gallery from '../pages/ArtGallery';
import Franchise from "../pages/Franchise";
import Footer from '../components/common/Footer';
import FAQ from "../pages/FAQs";
import Shop from './Shop';
import Reveal from '../components/Reveal'; // Import existing Reveal
import PageTransition from '../components/common/PageTransition'; // Import the new transition


const Home = () => {


  return (
    <PageTransition>
      <main className="min-h-screen bg-rabuste-bg text-rabuste-text selection:bg-rabuste-orange selection:text-white">
        <Navbar />
        <div className="relative z-10 bg-rabuste-bg">
          {/* Wrap sections in Reveal for scroll animation */}
          <section id="about">
            <Reveal>
              <Hero />
            </Reveal>
          </section>

          <section id="menu">
            <Reveal delay={0.1}>
              <MenuSection isPreview={true} />
            </Reveal>
          </section>
          
          <section id="shop">
            <Reveal delay={0.1}>
              <Shop isPreview={true} />
            </Reveal>
          </section>

          <section id="gallery">
            <Reveal>
              <Gallery isPreview={true} />
            </Reveal>
          </section>

          <section id="franchise">
             {/* Staggered delay for variety */}
            <Reveal delay={0.2}>
              <Franchise />
            </Reveal>
          </section>

          <Footer />
        </div>
      </main>
    </PageTransition>
  );
};

export default Home;