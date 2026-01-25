import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const CAPGEMINI_LOGO = 'https://www.capgemini.com/wp-content/themes/flavor/assets/dist/images/logos/capgemini-logo-color.svg';

function Layout({ children, sections }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} data-testid="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo" data-testid="logo-link">
            <img src={CAPGEMINI_LOGO} alt="Capgemini" className="logo-img" />
            <span>Newsletter</span>
          </Link>

          <div className="nav-links">
            {sections.map((section) => (
              <NavLink
                key={section.id}
                to={section.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                data-testid={`nav-link-${section.id}`}
              >
                {section.title.length > 25 ? section.title.substring(0, 22) + '...' : section.title}
              </NavLink>
            ))}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu" data-testid="mobile-menu">
            <NavLink
              to="/"
              className="nav-link"
              onClick={closeMobileMenu}
              data-testid="mobile-nav-home"
            >
              Home
            </NavLink>
            {sections.map((section) => (
              <NavLink
                key={section.id}
                to={section.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
                data-testid={`mobile-nav-${section.id}`}
              >
                {section.title}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="main-content">{children}</main>

      <footer className="footer" data-testid="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={CAPGEMINI_LOGO} alt="Capgemini" className="footer-logo" />
              <p className="footer-tagline">Get The Future You Want</p>
            </div>
            <div className="footer-links">
              <a href="https://www.capgemini.com" target="_blank" rel="noopener noreferrer" className="footer-link" data-testid="footer-website">
                Website
              </a>
              <a href="https://www.capgemini.com/careers" target="_blank" rel="noopener noreferrer" className="footer-link" data-testid="footer-careers">
                Careers
              </a>
              <a href="https://www.capgemini.com/about-us" target="_blank" rel="noopener noreferrer" className="footer-link" data-testid="footer-about">
                About Us
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Capgemini. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
