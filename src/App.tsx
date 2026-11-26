import { lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Pipeline } from './components/Pipeline';
import { SelectedWork } from './components/SelectedWork';

const BackgroundScene = lazy(() => import('./components/BackgroundScene'));

function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#180C2F_0%,#090612_48%,#030305_100%)]"
    />
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-[#F5F5F5]">
        <Suspense fallback={<SceneFallback />}>
          <BackgroundScene />
        </Suspense>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <SelectedWork />
            <Pipeline />
            <About />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
