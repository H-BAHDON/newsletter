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

      let html = null;
      let lastError = null;

      // Try each CORS proxy until one works
      for (const proxy of CORS_PROXIES) {
        try {
          const response = await fetch(proxy + encodeURIComponent(GOOGLE_DOC_URL));
          if (response.ok) {
            html = await response.text();
            break;
          }
        } catch (err) {
          lastError = err;
          continue;
        }
      }

      if (!html) {
        throw lastError || new Error('Failed to fetch document from all proxies');
      }

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
  
  // Get the main content area (Google Docs uses #contents or .doc-content)
  const contentDiv = doc.querySelector('#contents') || doc.querySelector('.doc-content') || doc.body;
  
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  // Map header text to section IDs - order matters for matching (most specific first)
  const sectionHeaders = [
    { patterns: ['an update from rachel h'], id: 'rachel-head' },
    { patterns: ['great place to work'], id: 'great-place-to-work' },
    { patterns: ['domains capability news'], id: 'domains-capability' },
    { patterns: ['domains networks'], id: 'domains-networks' },
    { patterns: ['sustainability corner'], id: 'sustainability' },
    { patterns: ['point of view'], id: 'point-of-view' },
    { patterns: ['sales'], id: 'sales' },
    { patterns: ['chapter'], id: 'chapter' }
  ];

  // Special case for "AI" - needs exact match since it's short
  const isAIHeader = (text) => {
    const trimmed = text.trim();
    return trimmed === 'AI' || trimmed === 'AI\n' || /^AI\s*$/.test(trimmed);
  };

  // Check if text matches any section header
  const findSectionId = (text) => {
    const normalizedText = text.toLowerCase().trim();
    
    // Check for exact AI match first
    if (isAIHeader(text)) {
      return 'ai';
    }
    
    for (const header of sectionHeaders) {
      for (const pattern of header.patterns) {
        if (normalizedText.includes(pattern)) {
          return header.id;
        }
      }
    }
    return null;
  };

  // Check if element is a section header
  const isHeader = (element) => {
    const tagName = element.tagName?.toLowerCase();
    const text = element.textContent?.trim() || '';
    
    if (!text) return null;
    
    // Google Docs uses h1 tags for main headers
    if (tagName === 'h1') {
      return findSectionId(text);
    }
    
    // Also check paragraphs with large styled text (Google Docs sometimes does this)
    if (tagName === 'p') {
      const sectionId = findSectionId(text);
      // Only match if the paragraph looks like a header (short text, specific patterns)
      if (sectionId && text.length < 100) {
        return sectionId;
      }
    }
    
    return null;
  };

  // Save current section content
  const saveCurrentSection = () => {
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = sanitizeAndProcessContent(currentContent.join(''));
    }
  };

  // Get all direct children and nested elements
  const getAllElements = (parent) => {
    const elements = [];
    const walk = (node) => {
      if (node.nodeType === 1) { // Element node
        elements.push(node);
        // Don't recurse into elements we've added - process siblings instead
      }
    };
    
    // Process direct children of the content container
    const docContent = parent.querySelector('.doc-content') || parent;
    Array.from(docContent.children).forEach(child => elements.push(child));
    
    return elements;
  };

  const elements = getAllElements(contentDiv);
  
  elements.forEach((element) => {
    const sectionId = isHeader(element);
    
    if (sectionId) {
      // Found a new header - save previous section and start new one
      saveCurrentSection();
      currentSection = sectionId;
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section (only if we're in a section)
      // Skip empty elements
      if (element.textContent?.trim() || element.querySelector('img')) {
        currentContent.push(element.outerHTML || '');
      }
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
