import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const GOOGLE_DOC_URL = process.env.REACT_APP_GOOGLE_DOC_URL || 
  'https://docs.google.com/document/d/e/2PACX-1vT7ebn-gWDjlSl0XZkP5xmdmltWAK44hYojISgalRiUg2746gWD-LRft06dS3z0Qvno5t6cjIeXDRNa/pub';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export function useGoogleDocContent() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(CORS_PROXY + encodeURIComponent(GOOGLE_DOC_URL));
      
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const html = await response.text();
      const sections = parseDocumentSections(html);
      setContent(sections);
    } catch (err) {
      console.error('Error fetching Google Doc:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, refetch: fetchContent };
}

function parseDocumentSections(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const body = doc.body || doc.querySelector('#contents') || doc.documentElement;
  
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  const sectionMap = {
    'an update from rachel head': 'rachel-head',
    'rachel head': 'rachel-head',
    'great place to work': 'great-place-to-work',
    'sales': 'sales',
    'domains capability news': 'domains-capability',
    'domains capability': 'domains-capability',
    'chapter': 'chapter',
    'domains networks': 'domains-networks',
    'sustainability corner': 'sustainability',
    'sustainability': 'sustainability',
    'aob': 'aob',
    'want to contribute': 'contribute',
    'contribute': 'contribute'
  };

  const findSectionId = (text) => {
    const normalizedText = text.toLowerCase().trim();
    for (const [key, value] of Object.entries(sectionMap)) {
      if (normalizedText.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const processElement = (element) => {
    const tagName = element.tagName?.toLowerCase();
    const text = element.textContent?.trim() || '';

    if ((tagName === 'h1' || tagName === 'h2' || 
        (tagName === 'p' && element.querySelector('span[style*="font-size"]'))) && text) {
      
      const sectionId = findSectionId(text);
      
      if (sectionId) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = sanitizeAndProcessContent(currentContent.join(''));
        }
        currentSection = sectionId;
        currentContent = [];
        return;
      }
    }

    if (currentSection) {
      currentContent.push(element.outerHTML || '');
    }
  };

  const children = body.children;
  for (let i = 0; i < children.length; i++) {
    processElement(children[i]);
  }

  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = sanitizeAndProcessContent(currentContent.join(''));
  }

  if (Object.keys(sections).length === 0) {
    const allContent = body.innerHTML;
    const defaultSections = ['rachel-head', 'great-place-to-work', 'sales', 'domains-capability', 
                           'chapter', 'domains-networks', 'sustainability', 'aob', 'contribute'];
    defaultSections.forEach(id => {
      sections[id] = sanitizeAndProcessContent(allContent);
    });
  }

  return sections;
}

function sanitizeAndProcessContent(html) {
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.style.maxWidth = '100%';
      node.style.height = 'auto';
      node.style.borderRadius = '12px';
      node.style.margin = '1.5rem 0';
    }
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  const sanitized = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'loading', 'style'],
    ALLOW_DATA_ATTR: true
  });

  DOMPurify.removeHook('afterSanitizeAttributes');

  return sanitized;
}

export default useGoogleDocContent;
