import { AlertCircle } from 'lucide-react';

const Input = ({ label, name, type, value, onChange, error }) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      {error && (
        <div className="invalid-feedback d-flex align-items-center">
          <AlertCircle className="me-1" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
