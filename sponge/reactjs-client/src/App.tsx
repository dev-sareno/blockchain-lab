import React from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import TransactionPage from './pages/transaction/TransactionPage';
import NodePage from './pages/node/NodePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav
          className='nav'
          style={{
            marginBottom: '30px'
          }}>
          <Link to="/transaction">Transaction</Link> |{" "}
          <Link to="/node">Node</Link>
        </nav>
        <Routes>
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/node" element={<NodePage />} />
          <Route path="/" element={<Navigate to={'/transaction'} replace />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
