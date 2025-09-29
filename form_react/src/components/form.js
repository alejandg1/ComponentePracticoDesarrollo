import React, { useState, useEffect } from "react";
import Input from "./imput";
import Select from "./select";
import RadioButtons from "./radioBtn";

const rules = {
  dni: {
    message: "DNI is required",
    pattern: { value: /^\d{8}$/, message: "DNI must be 8 digits" },
  },
  nombre: {
    message: "Name is required",
    minL: 2,
  },
  apellido: {
    message: "Last name is required",
    minL: 2,
  },
  fecha_nacimiento: {
    message: "Date of birth is required",
  },
  genero: {
    message: "Gender is required",
  },
  ciudad: {
    message: "City is required",
  },
};

const Form = () => {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    ciudad: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (showAlert && !Object.keys(errors).some(key => errors[key])) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, errors]);

  const validateField = (fieldName, value) => {
    const rule = rules[fieldName];
    if (!rule) return "";

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return rule.message;
    }

    if (rule.minL && trimmedValue.length < rule.minL) {
      return `Minimum ${rule.minL} characters required`;
    }

    if (rule.pattern && !rule.pattern.value.test(trimmedValue)) {
      return rule.pattern.message;
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);

    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User created:", result);
          setAlertMessage("User registered successfully!");
          setShowAlert(true);
          setFormData({
            dni: "",
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
            genero: "",
            ciudad: "",
          });
          setErrors({});
        } else {
          const errorData = await response.json();
          setAlertMessage(`Error: ${errorData.error || 'Failed to register user'}`);
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Network error:", error);
        setAlertMessage("Network error. Please make sure the server is running.");
        setShowAlert(true);
      }
    } else {
      setAlertMessage("Please correct the errors in the form before submitting.");
      setShowAlert(true);
      console.log("Form has errors:", errors);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">User Registration</h3>
            </div>
            <div className="card-body">
              {showAlert && (
                <div className={`alert ${errors && Object.keys(errors).some(key => errors[key]) ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
                  <strong>{errors && Object.keys(errors).some(key => errors[key]) ? 'Error!' : 'Success!'}</strong> {alertMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAlert(false)}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <Input 
                  label="DNI" 
                  name="dni" 
                  type="text" 
                  value={formData.dni}
                  onChange={handleChange}
                  error={errors.dni}
                />
                <Input 
                  label="First Name" 
                  name="nombre" 
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                />
                <Input 
                  label="Last Name" 
                  name="apellido" 
                  value={formData.apellido}
                  onChange={handleChange}
                  error={errors.apellido}
                />
                <Input 
                  label="Date of Birth" 
                  name="fecha_nacimiento" 
                  type="date" 
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  error={errors.fecha_nacimiento}
                />
                <RadioButtons
                  label="Gender"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  error={errors.genero}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
                <Select
                  label="City"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  error={errors.ciudad}
                  options={[
                    { value: "quito", label: "Quito" },
                    { value: "guayaquil", label: "Guayaquil" },
                    { value: "cuenca", label: "Cuenca" },
                    { value: "ambato", label: "Ambato" },
                    { value: "machala", label: "Machala" },
                  ]}
                />
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
