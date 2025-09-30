import React, { useState, useEffect } from 'react';

const UsersList = ({ onEditUser, onUserDeleted }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const alertClass = alertType === 'success' ? 'alert-success' : 'alert-danger';

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        showErrorAlert('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showErrorAlert('Network error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (dni) => {
    if (!window.confirm(`Are you sure you want to delete user with DNI: ${dni}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${dni}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showSuccessAlert('User deleted successfully!');
        loadUsers();
        if (onUserDeleted) onUserDeleted();
      } else {
        const errorData = await response.json();
        showErrorAlert(`Error: ${errorData.error || 'Failed to delete user'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showErrorAlert('Network error. Please make sure the server is running.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const capitalizeText = (text) => {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h3 className="card-title mb-0">Users List</h3>
              <button onClick={loadUsers} className="btn btn-light btn-sm">
                Refresh
              </button>
            </div>
            <div className="card-body">
              {showAlert && (
                <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
                  <strong>{alertType === 'success' ? 'Success!' : 'Error!'}</strong> {alertMessage}
                  <button type="button" className="btn-close" onClick={hideAlert} aria-label="Close"></button>
                </div>
              )}

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>DNI</th>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Birth Date</th>
                        <th>Gender</th>
                        <th>City</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.dni}</td>
                          <td>{user.nombre}</td>
                          <td>{user.apellido}</td>
                          <td>{formatDate(user.fecha_nacimiento)}</td>
                          <td>{capitalizeText(user.genero)}</td>
                          <td>{capitalizeText(user.ciudad)}</td>
                          <td>
                            <button onClick={() => onEditUser(user)} className="btn btn-warning btn-sm me-2">
                              Edit
                            </button>
                            <button onClick={() => deleteUser(user.dni)} className="btn btn-danger btn-sm">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;