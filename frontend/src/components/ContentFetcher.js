import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const GOOGLE_DOC_URL = process.env.REACT_APP_GOOGLE_DOC_URL || 
  'https://docs.google.com/document/d/e/2PACX-1vT7ebn-gWDjlSl0XZkP5xmdmltWAK44hYojISgalRiUg2746gWD-LRft06dS3z0Qvno5t6cjIeXDRNa/pub';

// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

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

  // Map header text to section IDs
  const sectionHeaders = [
    { patterns: ['an update from rachel head', 'rachel head'], id: 'rachel-head' },
    { patterns: ['great place to work'], id: 'great-place-to-work' },
    { patterns: ['sales'], id: 'sales' },
    { patterns: ['domains capability news', 'domains capability'], id: 'domains-capability' },
    { patterns: ['chapter'], id: 'chapter' },
    { patterns: ['domains networks'], id: 'domains-networks' },
    { patterns: ['sustainability corner', 'sustainability'], id: 'sustainability' },
    { patterns: ['aob'], id: 'aob' },
    { patterns: ['want to contribute', 'contribute to the newsletter'], id: 'contribute' }
  ];

  // Check if text matches any section header
  const findSectionId = (text) => {
    const normalizedText = text.toLowerCase().trim();
    for (const header of sectionHeaders) {
      for (const pattern of header.patterns) {
        if (normalizedText.includes(pattern)) {
          return header.id;
        }
      }
    }
    return null;
  };

  // Check if element is a header (Google Docs uses various formats)
  const isHeader = (element) => {
    const tagName = element.tagName?.toLowerCase();
    const text = element.textContent?.trim() || '';
    
    if (!text) return false;
    
    // Check for actual h1-h3 tags
    if (['h1', 'h2', 'h3'].includes(tagName)) {
      return findSectionId(text);
    }
    
    // Google Docs often uses styled spans for headers
    const spans = element.querySelectorAll('span');
    for (const span of spans) {
      const style = span.getAttribute('style') || '';
      // Look for larger font sizes (typically 18pt+ for headers)
      const fontSizeMatch = style.match(/font-size:\s*(\d+)/);
      if (fontSizeMatch && parseInt(fontSizeMatch[1]) >= 16) {
        const sectionId = findSectionId(span.textContent);
        if (sectionId) return sectionId;
      }
      // Also check for bold styling with section names
      if (style.includes('font-weight:700') || style.includes('font-weight:bold')) {
        const sectionId = findSectionId(span.textContent);
        if (sectionId) return sectionId;
      }
    }
    
    // Direct text match for simple headers
    return findSectionId(text);
  };

  // Save current section content
  const saveCurrentSection = () => {
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = sanitizeAndProcessContent(currentContent.join(''));
    }
  };

  // Process all child elements
  const allElements = body.querySelectorAll('*');
  const processedElements = new Set();
  
  // First pass: find all headers and mark their positions
  const headerPositions = [];
  allElements.forEach((element, index) => {
    const sectionId = isHeader(element);
    if (sectionId && !processedElements.has(element)) {
      headerPositions.push({ element, index, sectionId });
      processedElements.add(element);
    }
  });

  // Second pass: extract content between headers
  const children = Array.from(body.children);
  
  children.forEach((element) => {
    const sectionId = isHeader(element);
    
    if (sectionId) {
      // Found a new header - save previous section and start new one
      saveCurrentSection();
      currentSection = sectionId;
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section (only if we're in a section)
      currentContent.push(element.outerHTML || '');
    }
  });

  // Save the last section
  saveCurrentSection();

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
