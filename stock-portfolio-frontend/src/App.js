import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddEditStock from './components/AddEditStock';
import StockList from './components/StockList';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stocks" element={<StockList />} />
          <Route path="/add" element={<AddEditStock />} />
          <Route path="/edit/:id" element={<AddEditStock />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
