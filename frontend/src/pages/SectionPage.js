import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useGoogleDocContent } from '../components/ContentFetcher';

function SectionPage({ section }) {
  const { content, loading, error, refetch } = useGoogleDocContent();
  const sectionContent = content[section.id];

  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="section-page">
      <header className="page-header">
        <div className="container">
          <div className="page-header-content">
            <Link to="/" className="back-link" data-testid="back-to-home">
              <ArrowLeft size={18} />
              Back to Home
            </Link>
            <h1 className="page-title">{section.title}</h1>
            <div className="page-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} />
              Last updated: {formatDate()}
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <div className="container">
          <div className="content-wrapper">
            {loading && (
              <div className="loading-state" data-testid="loading-state">
                <div className="loading-spinner" />
                <p>Loading content...</p>
              </div>
            )}

            {error && (
              <div className="error-state" data-testid="error-state">
                <AlertCircle size={48} />
                <p>Unable to load content. Please try again.</p>
                <button 
                  onClick={refetch}
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  data-testid="retry-button"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && sectionContent && (
              <div 
                className="content-renderer animate-fade-in"
                dangerouslySetInnerHTML={{ __html: sectionContent }}
                data-testid="section-content"
              />
            )}

            {!loading && !error && !sectionContent && (
              <div className="empty-content" data-testid="empty-content">
                <p>No content available for this section yet.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Content will appear here once it's added to the Google Doc.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionPage;
