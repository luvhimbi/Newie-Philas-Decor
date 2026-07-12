import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Utensils,
  PartyPopper,
  Baby,
  Heart,
  Users,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Clock,
  Info,
  MessageCircle,
  Target,
  HeartHandshake,
  Star,
  Award,
  UsersRound,
} from 'lucide-react';
import GalleryCarousel from './components/GalleryCarousel';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';
import { FacebookIcon, TikTokIcon } from './components/SocialIcons';
import { FadeUp, MotionItem, Stagger } from './components/motion';
import { SITE } from './data/site';
import './index.css';

const galleryImages = [
  '/469207283_564283862992204_3106401350744891417_n.jpg',
  '/469231804_564278856326038_1086961304827374702_n.jpg',
  '/469259440_564285496325374_1182488209133371046_n.jpg',
  '/469325728_564282722992318_604722613996058945_n.jpg',
  '/469344896_565512452869345_4233520216232603559_n.jpg',
  '/469354435_566090226144901_5676921295966620121_n.jpg',
  '/469357676_564285652992025_206819789307558443_n.jpg',
  '/469358544_565512252869365_8831836146926286467_n.jpg',
  '/469399593_566082449479012_2168524733048518792_n.jpg',
  '/469549257_565512099536047_6408865408968786256_n.jpg',
  '/469840002_568561872564403_5345761024991478859_n.jpg',
  '/469845770_568585459228711_4337655302858195448_n.jpg',
  '/469962135_568562072564383_483692655452309095_n.jpg',
  '/470555269_574373425316581_9176084575297050817_n.jpg',
  '/470658687_573584385395485_5341763288042407354_n.jpg',
  '/470879995_574373465316577_4029426834870299291_n.jpg',
  '/471139059_574347205319203_5751652373524118764_n.jpg',
  '/471166450_574347238652533_4221410776714398325_n.jpg',
  '/471840626_582247354529188_2033451029564125645_n.jpg',
  '/472022052_582247497862507_5185811782084214503_n.jpg',
  '/472266135_585147147572542_4390639968109744399_n.jpg',
  '/472283910_585150127572244_36151267512219310_n.jpg',
  '/472654430_586310904122833_3772401208126779749_n.jpg',
  '/472655928_586448724109051_3173433639466498294_n.jpg',
  '/472684491_585153257571931_6405876209400387559_n.jpg',
  '/472843362_586310867456170_5846895791838194876_n.jpg',
  '/473177849_589772287110028_5766100521557004924_n.jpg',
  '/473349814_590457683708155_6281155300023196748_n.jpg',
  '/474592189_600453162708607_8757066400316501806_n.jpg',
  '/474903248_599865946100662_595475587233405175_n.jpg',
  '/475120112_600446339375956_6747744232227367336_n.jpg',
  '/475271631_600087446078512_7778708004642364317_n.jpg',
  '/583111594_756193180772182_7955203168607946303_n.jpg',
];

const services = [
  {
    icon: Utensils,
    title: 'Picnic',
    description: 'Stunning outdoor setups for a relaxing and beautiful picnic experience.',
  },
  {
    icon: PartyPopper,
    title: 'Parties',
    description: 'Vibrant and themed decorations for birthdays and special celebrations.',
  },
  {
    icon: Baby,
    title: 'Baby Shower',
    description: 'Elegant decor to welcome your new addition with style and joy.',
  },
  {
    icon: Heart,
    title: 'Weddings',
    description: 'Breathtaking arrangements to make your big day truly magical.',
  },
  {
    icon: Users,
    title: 'Family Gathering',
    description: 'Cozy and beautiful settings for creating memories with loved ones.',
  },
  {
    icon: Sparkles,
    title: 'Custom Events',
    description: 'Contact us for customized decor tailored exactly to your vision.',
  },
];

const mission = {
  icon: Target,
  title: 'Our Mission',
  text: 'To transform every celebration into a beautiful, memorable experience — bringing creativity, care, and premium decor to families and communities across Venda and beyond.',
};

const coreValues = [
  {
    icon: HeartHandshake,
    title: 'Passion & Heart',
    description: 'Every setup is personal to us. We pour genuine care into each event, treating your celebration as if it were our own.',
  },
  {
    icon: Star,
    title: 'Creativity',
    description: 'We bring fresh, original ideas to every occasion — turning your vision into decor that feels unique and unforgettable.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'From the finest details to the final reveal, we never compromise on the standard of our work.',
  },
  {
    icon: UsersRound,
    title: 'Family & Community',
    description: 'Rooted in Venda and built by siblings, we understand the importance of family, culture, and community in every celebration.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We show up on time, deliver what we promise, and make sure your event runs smoothly from setup to breakdown.',
  },
  {
    icon: Sparkles,
    title: 'Accessible Elegance',
    description: 'Beautiful decor should be within reach. We offer premium setups that suit your budget without sacrificing style.',
  },
];

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const WHATSAPP_URL = "https://wa.me/27814170801?text=Hi%2C%20I'd%20like%20to%20book%20decor%20services.";

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeUp className="section-header">
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </FadeUp>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <a href="#" className="logo-container">
            <img src="/Logo.jpeg" alt="Newie & Phila's Decor Logo" className="logo-img" />
            <div className="header-title">NEWIE & PHILA'S DECOR</div>
          </a>

          <nav className="nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href="tel:0814170801" className="header-cta">
              <Phone size={14} />
              <span className="header-cta-full">081 417 0801</span>
              <span className="header-cta-short">Call Us</span>
            </a>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={closeMenu}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="tel:0814170801"
              className="btn btn-primary"
              onClick={closeMenu}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
            >
              <Phone size={16} />
              Call Us
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-overlay" />

          <Stagger className="hero-content container" animateOnView={false}>
            <MotionItem>
              <p className="hero-badge">Premium Event Decor · Venda</p>
            </MotionItem>

            <MotionItem>
              <h1 className="hero-title">
                Crafting Unforgettable
                <span>Experiences</span>
              </h1>
            </MotionItem>

            <MotionItem>
              <p className="hero-subtitle">
                We bring your vision to life with stunning decor for weddings, celebrations,
                and every special moment worth remembering.
              </p>
            </MotionItem>

            <MotionItem>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  <Phone size={16} />
                  Book Us Today
                </a>
                <a href="#gallery" className="btn btn-outline-light">
                  View Our Work
                  <ArrowRight size={16} />
                </a>
              </div>
            </MotionItem>

            <MotionItem>
              <p className="hero-trust">
                Weddings <span>·</span> Parties <span>·</span> Baby Showers <span>·</span> More
              </p>
            </MotionItem>
          </Stagger>
        </section>

        <section className="about" id="about">
          <div className="container">
            <SectionHeader
              label="Who We Are"
              title="Our Story"
              subtitle="A sibling-run decor business born from passion, creativity, and the heart of Venda."
            />

            <FadeUp className="about-story">
              <div className="about-story-content">
                <p>
                  <strong>Newie & Phila's Decor</strong> was founded by siblings{' '}
                  <strong>Ronewa</strong> and <strong>Philadaphia Mahodze</strong> — known
                  affectionately as Newie and Phila. Growing up on Punda Maria Road in
                  Tshilungoma, Thohoyandou (0950), Venda, they shared a love for beautiful
                  spaces and bringing people together.
                </p>
                <p>
                  Right after finishing high school, with nothing but creativity, determination,
                  and the support of their family, Ronewa and Philadaphia turned their passion
                  into a business. What started as small setups for friends and neighbours quickly
                  grew through word of mouth, as more people saw the care and beauty they brought
                  to every event.
                </p>
                <p>
                  Today, Newie & Phila's Decor is a trusted name across Venda for weddings,
                  baby showers, picnics, parties, and family gatherings. Still run by the same
                  brother-and-sister team, the business remains true to its roots — personal,
                  heartfelt, and deeply connected to the community they call home.
                </p>
              </div>
              <div className="about-founders">
                <div className="founder-card">
                  <span className="founder-name">Ronewa Mahodze</span>
                  <span className="founder-nickname">"Newie"</span>
                  <span className="founder-role">Co-Founder</span>
                </div>
                <div className="founder-card">
                  <span className="founder-name">Philadaphia Mahodze</span>
                  <span className="founder-nickname">"Phila"</span>
                  <span className="founder-role">Co-Founder</span>
                </div>
                <div className="about-location">
                  <MapPin size={18} />
                  <span>Punda Maria Road, Tshilungoma, Thohoyandou, 0950 — Venda</span>
                </div>
              </div>
            </FadeUp>

            <FadeUp className="about-mission" delay={0.1}>
              <mission.icon size={32} className="about-mission-icon" />
              <h3>{mission.title}</h3>
              <p>{mission.text}</p>
            </FadeUp>

            <div className="about-values-section">
              <FadeUp>
                <h3 className="about-values-heading">Our Values</h3>
              </FadeUp>
              <Stagger className="about-values-grid">
                {coreValues.map((value) => (
                  <MotionItem key={value.title} className="about-value-card">
                    <value.icon size={24} className="about-value-icon" />
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </MotionItem>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <SectionHeader
              label="What We Offer"
              title="Our Services"
              subtitle="From intimate picnics to grand weddings, we create beautiful spaces that make every occasion extraordinary."
            />
            <Stagger className="services-grid">
              {services.map((service) => (
                <MotionItem key={service.title} className="service-card">
                  <div className="service-icon-wrap">
                    <service.icon size={28} className="service-icon" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </MotionItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="section section-bg-cream" id="gallery">
          <div className="container">
            <SectionHeader
              label="Portfolio"
              title="Our Work"
              subtitle="Browse through our collection of beautifully crafted decor setups for every occasion."
            />
            <FadeUp>
              <GalleryCarousel images={galleryImages} />
            </FadeUp>
          </div>
        </section>

        <section className="booking-cta">
          <div className="container">
            <FadeUp>
              <div className="booking-card">
                <Info size={32} className="booking-icon" />
                <h2>Booking Policy</h2>
                <p>
                  To secure your date, a <strong>50% deposit</strong> is required.
                  Please note this deposit fee is <strong>non-refundable</strong>.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container">
            <SectionHeader
              label="Reach Out"
              title="Contact Us"
              subtitle="Ready to bring your event to life? Get in touch and let's start planning your perfect setup."
            />
            <Stagger className="contact-grid">
              <MotionItem className="contact-card" as="a" href="tel:0814170801">
                <Phone size={28} className="contact-icon" />
                <h3>Call Us</h3>
                <p>081 417 0801</p>
              </MotionItem>
              <MotionItem className="contact-card" as="a" href="tel:0661558793">
                <Phone size={28} className="contact-icon" />
                <h3>Call Us</h3>
                <p>066 155 8793</p>
              </MotionItem>
              <MotionItem
                className="contact-card contact-card-whatsapp"
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={28} className="contact-icon" />
                <h3>WhatsApp</h3>
                <p>Message us directly</p>
              </MotionItem>
              <MotionItem className="contact-card">
                <MapPin size={28} className="contact-icon" />
                <h3>Location</h3>
                <p>Tshilungoma, Thohoyandou, Venda</p>
              </MotionItem>
            </Stagger>
            <FadeUp className="contact-map" delay={0.1}>
              <iframe
                title="Newie & Phila's Decor location on Google Maps"
                src={SITE.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeUp>
            <FadeUp className="contact-map-link">
              <a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} />
                Open in Google Maps
              </a>
            </FadeUp>
            <FadeUp className="contact-cta" delay={0.15}>
              <a href={WHATSAPP_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <a href="tel:0814170801" className="btn btn-outline">
                <Phone size={16} />
                Call Now
              </a>
            </FadeUp>
          </div>
        </section>
      </main>

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="#" className="footer-logo">
                <img src={SITE.logo} alt={`${SITE.name} logo`} className="footer-logo-img" />
                <span className="footer-logo-text">{SITE.name}</span>
              </a>
              <p>
                Bringing your vision to life with premium decor setups for every occasion.
                Founded by Ronewa & Philadaphia Mahodze in Thohoyandou, Venda.
              </p>
              <div className="footer-social">
                <a
                  href={SITE.social.facebook}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon size={18} />
                </a>
                <a
                  href={SITE.social.tiktok}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                >
                  <TikTokIcon size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3>Quick Links</h3>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="footer-link">
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <div>
              <h3>Contact</h3>
              <a href="tel:0814170801" className="footer-link">
                <Phone size={18} />
                <span>081 417 0801</span>
              </a>
              <a href="tel:0661558793" className="footer-link">
                <Phone size={18} />
                <span>066 155 8793</span>
              </a>
              <a href={SITE.mapsLink} className="footer-link" target="_blank" rel="noopener noreferrer">
                <MapPin size={18} />
                <span>{SITE.address}</span>
              </a>
            </div>

            <div>
              <h3>Follow Us</h3>
              <a href={SITE.social.facebook} className="footer-link" target="_blank" rel="noopener noreferrer">
                <FacebookIcon size={18} />
                <span>Phila's Decor on Facebook</span>
              </a>
              <a href={SITE.social.tiktok} className="footer-link" target="_blank" rel="noopener noreferrer">
                <TikTokIcon size={18} />
                <span>@philasdecor on TikTok</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} {SITE.name}. All Rights Reserved.
          </div>
        </div>
      </motion.footer>

      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}

export default App;
