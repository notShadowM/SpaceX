import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import RecentLaunch from './components/RecentLaunches';

function App() {
  return (
    <>
      <Sidebar />
      <RecentLaunch />
    </>
  );
}

export default App;
