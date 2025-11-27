import React, { useState } from 'react';
import CreateEvent from './CreateEvent';
import ViewEvent from './ViewEvent';


const HomePage = () => {
  const [activePage, setActivePage] = useState('create');

  return (
    <div className="homepage">
      <div className="nav-tab">
        <button
          className="tab-switch"
          onClick={() => setActivePage(activePage === 'create' ? 'view' : 'create')}
        >
          {activePage === 'create' ? 'Events' : 'Create'}
        </button>
      </div>
      <div className="page-content">
        {activePage === 'create' ? <CreateEvent /> : <ViewEvent />}
      </div>
    </div>
  );
};

export default HomePage;
