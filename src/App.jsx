import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import RecentLaunch from './components/RecentLaunches';
import Missions from './components/Missions';
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route exact path="/" element={<div>hello</div>} />
        <Route exact path="/RecentLaunches" element={<RecentLaunch />} />
        <Route exact path="/Missions" element={<Missions />} />
      </Routes>
    </Router>
  );
}

export default App;
