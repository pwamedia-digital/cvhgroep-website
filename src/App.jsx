import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import Intro from './components/sections/Intro'
import Services from './components/sections/Services'
import SignatureProject from './components/sections/SignatureProject'
import Story from './components/sections/Story'
import Gallery from './components/sections/Gallery'
import Process from './components/sections/Process'
import Testimonials from './components/sections/Testimonials'
import Contact from './components/sections/Contact'

export default function App() {
  return (
    <>
      <a
        href="#specialisaties"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:font-sans focus:text-sm focus:font-600 focus:text-white"
      >
        Naar hoofdinhoud
      </a>

      <Header />

      <main>
        <Hero />
        <Marquee />
        <Intro />
        <Services />
        <SignatureProject />
        <Story />
        <Gallery />
        <Process />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
