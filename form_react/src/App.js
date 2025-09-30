import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import CreateUser from './components/CreateUser';
import UsersList from './components/UsersList';
import EditUserModal from './components/EditUserModal';

function App() {
  const [currentView, setCurrentView] = useState('create');
  const [userToEdit, setUserToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowEditModal(false);
    setUserToEdit(null);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    setUserToEdit(null);
    if (window.usersListRef) {
      window.usersListRef.loadUsers();
    }
  };

  const handleUserDeleted = () => {
    console.log('User deleted, refreshing list if needed');
  };

  return (
    <div className="App">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main>
        {currentView === 'create' && <CreateUser />}
        {currentView === 'list' && (
          <UsersList 
            onEditUser={handleEditUser}
            onUserDeleted={handleUserDeleted}
          />
        )}
      </main>

      {showEditModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <EditUserModal 
                  user={userToEdit} 
                  onUserUpdated={handleUserUpdated}
                  onCancel={() => setShowEditModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
