import React, { useState, useEffect } from 'react';

const EditUserModal = ({ user, onUserUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    ciudad: ''
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const rules = {
    nombre: {
      message: "Name is required",
      minLength: 2
    },
    apellido: {
      message: "Last name is required",
      minLength: 2
    },
    fecha_nacimiento: {
      message: "Date of birth is required"
    },
    genero: {
      message: "Gender is required"
    },
    ciudad: {
      message: "City is required"
    }
  };

  const alertClass = alertType === 'success' ? 'alert-success' : 'alert-danger';

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
        genero: user.genero,
        ciudad: user.ciudad
      });
    }
  }, [user]);

  const validateField = (fieldName, value) => {
    const rule = rules[fieldName];
    if (!rule) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
      return;
    }

    const trimmedValue = value ? value.toString().trim() : '';

    if (!trimmedValue) {
      setErrors(prev => ({ ...prev, [fieldName]: rule.message }));
      return;
    }

    if (rule.minLength && trimmedValue.length < rule.minLength) {
      setErrors(prev => ({ ...prev, [fieldName]: `Minimum ${rule.minLength} characters required` }));
      return;
    }

    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(formData).forEach(fieldName => {
      const rule = rules[fieldName];
      if (rule) {
        const trimmedValue = formData[fieldName] ? formData[fieldName].toString().trim() : '';
        if (!trimmedValue) {
          newErrors[fieldName] = rule.message;
          isValid = false;
        } else if (rule.minLength && trimmedValue.length < rule.minLength) {
          newErrors[fieldName] = `Minimum ${rule.minLength} characters required`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);

    if (validateForm()) {
      try {
        const response = await fetch(`http://localhost:5000/users/${user.dni}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User updated:", result);
          showSuccessAlert("User updated successfully!");
          setTimeout(() => {
            onUserUpdated();
          }, 1500);
        } else {
          const errorData = await response.json();
          showErrorAlert(`Error: ${errorData.error || 'Failed to update user'}`);
        }
      } catch (error) {
        console.error("Network error:", error);
        showErrorAlert("Network error. Please make sure the server is running.");
      }
    } else {
      showErrorAlert("Please correct the errors in the form before submitting.");
    }
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertType('success');
    setShowAlert(true);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && (
        <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
          <strong>{alertType === 'success' ? 'Success!' : 'Error!'}</strong> {alertMessage}
          <button type="button" className="btn-close" onClick={hideAlert} aria-label="Close"></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">DNI</label>
              <input
                type="text"
                value={user?.dni || ''}
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              />
              {errors.nombre && (
                <div className="invalid-feedback">
                  <span>{errors.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              />
              {errors.apellido && (
                <div className="invalid-feedback">
                  <span>{errors.apellido}</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className={`form-control ${errors.fecha_nacimiento ? 'is-invalid' : ''}`}
              />
              {errors.fecha_nacimiento && (
                <div className="invalid-feedback">
                  <span>{errors.fecha_nacimiento}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="genero"
                    value="male"
                    checked={formData.genero === 'male'}
                    onChange={handleChange}
                    className="form-check-input"
                    id="modal-gender-male"
                  />
                  <label className="form-check-label" htmlFor="modal-gender-male">Male</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="genero"
                    value="female"
                    checked={formData.genero === 'female'}
                    onChange={handleChange}
                    className="form-check-input"
                    id="modal-gender-female"
                  />
                  <label className="form-check-label" htmlFor="modal-gender-female">Female</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="genero"
                    value="other"
                    checked={formData.genero === 'other'}
                    onChange={handleChange}
                    className="form-check-input"
                    id="modal-gender-other"
                  />
                  <label className="form-check-label" htmlFor="modal-gender-other">Other</label>
                </div>
              </div>
              {errors.genero && (
                <div className="text-danger small">
                  <span>{errors.genero}</span>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">City</label>
              <select
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={`form-select ${errors.ciudad ? 'is-invalid' : ''}`}
              >
                <option value="" disabled>Select an option</option>
                <option value="quito">Quito</option>
                <option value="guayaquil">Guayaquil</option>
                <option value="cuenca">Cuenca</option>
                <option value="ambato">Ambato</option>
                <option value="machala">Machala</option>
              </select>
              {errors.ciudad && (
                <div className="invalid-feedback">
                  <span>{errors.ciudad}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;