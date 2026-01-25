import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SectionPage from './pages/SectionPage';
import './App.css';

const sections = [
  { id: 'rachel-head', title: 'An update from Rachel Head…', path: '/rachel-head' },
  { id: 'great-place-to-work', title: 'Great Place To Work', path: '/great-place-to-work' },
  { id: 'sales', title: 'Sales', path: '/sales' },
  { id: 'domains-capability', title: 'Domains Capability News', path: '/domains-capability' },
  { id: 'chapter', title: 'Chapter', path: '/chapter' },
  { id: 'domains-networks', title: 'Domains Networks', path: '/domains-networks' },
  { id: 'sustainability', title: 'Sustainability Corner', path: '/sustainability' },
  { id: 'aob', title: 'AOB', path: '/aob' },
  { id: 'contribute', title: 'Want to contribute to the newsletter?', path: '/contribute' }
];

function App() {
  return (
    <Router>
      <Layout sections={sections}>
        <Routes>
          <Route path="/" element={<Home sections={sections} />} />
          {sections.map((section) => (
            <Route
              key={section.id}
              path={section.path}
              element={<SectionPage section={section} />}
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
