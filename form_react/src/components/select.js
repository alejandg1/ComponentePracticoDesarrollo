import { AlertCircle } from 'lucide-react';

const Select = ({ label, name, options, value, onChange, error }) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'is-invalid' : ''}`}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback d-flex align-items-center">
          <AlertCircle className="me-1" size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;
