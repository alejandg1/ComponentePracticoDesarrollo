import { AlertCircle } from 'lucide-react';

const RadioButtons = ({ label, name, options, value, onChange, error }) => {
  return (
    <div className="mb-3">
      {label && <div className="form-label">{label}</div>}
      <div>
        {options.map((option, index) => (
          <div key={index} className="form-check form-check-inline me-4">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className={`form-check-input ${error ? 'is-invalid' : ''}`}
              id={`${name}-${option.value}`}
            />
            <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <div className="invalid-feedback d-flex align-items-center">
          <AlertCircle className="me-1" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};


export default RadioButtons;