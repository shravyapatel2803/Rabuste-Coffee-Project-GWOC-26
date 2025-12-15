import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section - Bold & Cozy */}
      <section className="h-screen flex items-center justify-center bg-[#2c241b] text-[#e8dcc4]">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-4">BOLD. COZY. ROBUSTA.</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Experience the finest Robusta coffee in a space where art meets caffeine.
          </p>
          <button className="mt-8 px-6 py-3 bg-[#c9a66b] text-black font-bold rounded-full hover:bg-[#b08d55] transition">
            Explore the Menu
          </button>
        </motion.div>
      </section>

      {/* Philosophy / Why Robusta Section */}
      <section className="py-20 px-10">
        <h2 className="text-4xl font-bold text-center mb-10">Why Robusta?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">More Caffeine</h3>
            <p>Double the kick, double the focus.</p>
          </div>
          <div className="card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Bold Flavor</h3>
            <p>Deep, earthy, and chocolatey notes.</p>
          </div>
          <div className="card p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Art Gallery</h3>
            <p>Sip coffee while admiring curated fine art.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;