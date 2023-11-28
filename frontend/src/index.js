import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import reportWebVitals from './reportWebVitals';
import AdditionalSearching from './pages/AdditionalSearching';
import MainSearching from './pages/MainSearching'
import CurrencySearching from './pages/CurrencySearching'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BurgerMenu from './pages/sidebar';

export default function App() {
  return(
    <BrowserRouter>
      <div data-testid="cypress-burgermenu" id="outer-container" className="App">
        <BurgerMenu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}/>
        <main id="page-wrap">
          <Routes>
              <Route path="/" element={<MainSearching />} />
              <Route path="/region-search" element={<AdditionalSearching />} />
              <Route path="/currency-search" element={<CurrencySearching />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
