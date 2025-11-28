import React from 'react';
import HomePage from './pages/HomePage';

const App = () => {

  return (
    <div className="app">
      <header className="app-header">
        <h1>EVENTAGRAM</h1>
      </header>
      <main className="app-main">
        <div className="content-box">
          <img src='/boy.png' className='boy-pic'></img>
          <HomePage />
        </div>
      </main>
    </div>
  );
};

export default App;
