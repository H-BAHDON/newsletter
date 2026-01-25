# Capgemini Newsletter - Product Requirements Document

## Original Problem Statement
Build a React newsletter website where content is dynamically fetched from Google Docs. The site has 9 sections with Capgemini branding, corporate/business style, fixed top navigation.

## User Personas
- **Visitors**: Capgemini employees viewing newsletter content
- **Editors**: Content managers updating Google Docs without coding

## Core Requirements
- Frontend-only React app (no backend)
- Content fetched from published Google Docs
- **Section isolation**: Each header shows ONLY its content (until next header)
- Capgemini branding (Blue #0070AD)
- Fixed top navigation
- Responsive design
- HTML sanitization (DOMPurify)

## Architecture
- **Frontend**: React 18 + React Router 6 (client-side only)
- **Styling**: Custom CSS with Capgemini brand colors
- **Content**: Google Docs published HTML via CORS proxy fallbacks
- **Sanitization**: DOMPurify for safe HTML rendering

## What's Been Implemented (Jan 25, 2026)
- ✅ Fixed navbar with 9 section links
- ✅ Homepage with section cards
- ✅ **Proper section parsing** - each page shows only content between its header and the next
- ✅ Capgemini branding (logo, colors)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Mobile hamburger menu
- ✅ CORS proxy fallbacks for reliability
- ✅ Footer with Capgemini links

## Google Doc URL
https://docs.google.com/document/d/e/2PACX-1vT7ebn-gWDjlSl0XZkP5xmdmltWAK44hYojISgalRiUg2746gWD-LRft06dS3z0Qvno5t6cjIeXDRNa/pub

## How Section Parsing Works
- Google Doc uses H1 tags for section headers
- Parser finds each header and collects content until next header
- Each section is isolated and stored separately

## Sections
1. An update from Rachel Head
2. Great Place To Work
3. Sales
4. Domains Capability News
5. Chapter
6. Domains Networks
7. Sustainability Corner
8. AOB
9. Want to contribute (Point of View)
