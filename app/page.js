import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MenuGrid from '../components/MenuGrid';
import LocationSection from '../components/LocationSection';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <MenuGrid />
      <LocationSection />
      <Footer />
    </>
  );
}

