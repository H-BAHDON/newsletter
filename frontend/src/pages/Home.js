import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, TrendingUp, Globe, BookOpen, Network, Leaf, FileText, PenTool, User } from 'lucide-react';

const CAPGEMINI_LOGO = 'https://www.capgemini.com/wp-content/themes/flavor/assets/dist/images/logos/capgemini-logo-color.svg';

const sectionImages = {
  'rachel-head': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  'great-place-to-work': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  'sales': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'domains-capability': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  'chapter': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  'domains-networks': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  'sustainability': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  'aob': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  'contribute': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
};

const sectionIcons = {
  'rachel-head': User,
  'great-place-to-work': Users,
  'sales': TrendingUp,
  'domains-capability': Globe,
  'chapter': BookOpen,
  'domains-networks': Network,
  'sustainability': Leaf,
  'aob': FileText,
  'contribute': PenTool
};

const sectionDescriptions = {
  'rachel-head': 'Leadership insights and strategic updates from Rachel Head',
  'great-place-to-work': 'Celebrating our culture and workplace excellence',
  'sales': 'Latest achievements and opportunities in sales',
  'domains-capability': 'News from our specialized domain capabilities',
  'chapter': 'Community updates and chapter highlights',
  'domains-networks': 'Connecting across our global networks',
  'sustainability': 'Our commitment to environmental responsibility',
  'aob': 'Additional updates and announcements',
  'contribute': 'Share your stories and be part of the newsletter'
};

function Home({ sections }) {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <img src={CAPGEMINI_LOGO} alt="Capgemini" className="hero-logo" />
            <h1 className="hero-title">Internal Newsletter</h1>
            <p className="hero-subtitle">
              Stay connected with the latest updates, achievements, and stories from across our organization. 
              Explore our sections below to discover what's happening at Capgemini.
            </p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="sections-grid">
          {sections.map((section, index) => {
            const Icon = sectionIcons[section.id] || FileText;
            return (
              <Link
                key={section.id}
                to={section.path}
                className={`section-card animate-fade-in-delay-${Math.min(index % 4, 3)}`}
                data-testid={`section-card-${section.id}`}
              >
                <div className="section-card-image">
                  <img 
                    src={sectionImages[section.id]} 
                    alt={section.title}
                    loading="lazy"
                  />
                  <div className="section-card-overlay" />
                </div>
                <div className="section-card-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Icon size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Section
                    </span>
                  </div>
                  <h3 className="section-card-title">{section.title}</h3>
                  <p className="section-card-desc">{sectionDescriptions[section.id]}</p>
                  <div className="section-card-arrow">
                    Read more <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
