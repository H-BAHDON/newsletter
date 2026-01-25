# Capgemini Newsletter - Product Requirements Document

## Original Problem Statement
Build a React newsletter website where content is dynamically fetched from Google Docs. The site has 9 sections with Capgemini branding, corporate/business style, fixed top navigation.

## User Personas
- **Visitors**: Capgemini employees viewing newsletter content
- **Editors**: Content managers updating Google Docs without coding
- **Developers**: Maintaining and deploying the site

## Core Requirements
- React frontend with routing for 9 sections
- Content fetched from published Google Docs
- Capgemini branding (Blue #0070AD)
- Fixed top navigation
- Responsive design
- HTML sanitization (DOMPurify)
- No backend required

## Architecture
- **Frontend**: React 18 + React Router 6
- **Styling**: Custom CSS with Capgemini brand colors
- **Content**: Google Docs published HTML via CORS proxy
- **Sanitization**: DOMPurify for safe HTML rendering

## What's Been Implemented (Jan 25, 2026)
- ✅ Fixed navbar with 9 section links
- ✅ Homepage with bento grid of section cards
- ✅ Individual section pages with Google Docs content
- ✅ Capgemini branding (logo, colors)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Mobile hamburger menu
- ✅ Content fetching with loading states
- ✅ Error handling with retry functionality
- ✅ Footer with Capgemini links

## Google Doc URL
https://docs.google.com/document/d/e/2PACX-1vT7ebn-gWDjlSl0XZkP5xmdmltWAK44hYojISgalRiUg2746gWD-LRft06dS3z0Qvno5t6cjIeXDRNa/pub

## Sections
1. An update from Rachel Head
2. Great Place To Work
3. Sales
4. Domains Capability News
5. Chapter
6. Domains Networks
7. Sustainability Corner
8. AOB
9. Want to contribute to the newsletter?

## Next Steps / Backlog
- P1: Add search functionality
- P2: Add offline caching
- P2: Add print-friendly version
- P3: Add dark mode toggle
