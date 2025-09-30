import React from 'react';

const Navigation = ({ currentView, onViewChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={() => onViewChange('create')}>
          User Management
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                className={`nav-link ${currentView === 'create' ? 'active' : ''}`}
                href="#" 
                onClick={() => onViewChange('create')}
              >
                Create User
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentView === 'list' ? 'active' : ''}`}
                href="#" 
                onClick={() => onViewChange('list')}
              >
                Users List
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;