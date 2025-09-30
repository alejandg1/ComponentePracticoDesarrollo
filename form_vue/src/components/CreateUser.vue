<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="card-title mb-0">Create New User</h3>
          </div>
          <div class="card-body">
            <div v-if="showAlert" :class="alertClass" class="alert alert-dismissible fade show" role="alert">
              <strong>{{ alertType === 'success' ? 'Success!' : 'Error!' }}</strong> {{ alertMessage }}
              <button type="button" class="btn-close" @click="hideAlert" aria-label="Close"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">DNI</label>
                <input
                  type="text"
                  v-model="formData.dni"
                  @input="validateField('dni')"
                  :class="['form-control', { 'is-invalid': errors.dni }]"
                />
                <div v-if="errors.dni" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.dni }}</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">First Name</label>
                <input
                  type="text"
                  v-model="formData.nombre"
                  @input="validateField('nombre')"
                  :class="['form-control', { 'is-invalid': errors.nombre }]"
                />
                <div v-if="errors.nombre" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.nombre }}</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input
                  type="text"
                  v-model="formData.apellido"
                  @input="validateField('apellido')"
                  :class="['form-control', { 'is-invalid': errors.apellido }]"
                />
                <div v-if="errors.apellido" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.apellido }}</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Date of Birth</label>
                <input
                  type="date"
                  v-model="formData.fecha_nacimiento"
                  @input="validateField('fecha_nacimiento')"
                  :class="['form-control', { 'is-invalid': errors.fecha_nacimiento }]"
                />
                <div v-if="errors.fecha_nacimiento" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.fecha_nacimiento }}</span>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-label">Gender</div>
                <div>
                  <div class="form-check form-check-inline me-4">
                    <input
                      type="radio"
                      value="male"
                      v-model="formData.genero"
                      @change="validateField('genero')"
                      :class="['form-check-input', { 'is-invalid': errors.genero }]"
                      id="gender-male"
                    />
                    <label class="form-check-label" for="gender-male">Male</label>
                  </div>
                  <div class="form-check form-check-inline me-4">
                    <input
                      type="radio"
                      value="female"
                      v-model="formData.genero"
                      @change="validateField('genero')"
                      :class="['form-check-input', { 'is-invalid': errors.genero }]"
                      id="gender-female"
                    />
                    <label class="form-check-label" for="gender-female">Female</label>
                  </div>
                  <div class="form-check form-check-inline me-4">
                    <input
                      type="radio"
                      value="other"
                      v-model="formData.genero"
                      @change="validateField('genero')"
                      :class="['form-check-input', { 'is-invalid': errors.genero }]"
                      id="gender-other"
                    />
                    <label class="form-check-label" for="gender-other">Other</label>
                  </div>
                </div>
                <div v-if="errors.genero" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.genero }}</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">City</label>
                <select
                  v-model="formData.ciudad"
                  @change="validateField('ciudad')"
                  :class="['form-select', { 'is-invalid': errors.ciudad }]"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="quito">Quito</option>
                  <option value="guayaquil">Guayaquil</option>
                  <option value="cuenca">Cuenca</option>
                  <option value="ambato">Ambato</option>
                  <option value="machala">Machala</option>
                </select>
                <div v-if="errors.ciudad" class="invalid-feedback d-flex align-items-center">
                  <span>{{ errors.ciudad }}</span>
                </div>
              </div>


              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateUser',
  data() {
    return {
      formData: {
        dni: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        ciudad: ''
      },
      errors: {},
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      rules: {
        dni: {
          message: "DNI is required",
          pattern: /^\d{10}$/,
          patternMessage: "DNI must be 10 digits"
        },
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
      }
    }
  },
  computed: {
    alertClass() {
      return this.alertType === 'success' ? 'alert-success' : 'alert-danger';
    }
  },
  methods: {
    validateField(fieldName) {
      const value = this.formData[fieldName];
      const rule = this.rules[fieldName];
      
      if (!rule) {
        this.$set(this.errors, fieldName, '');
        return;
      }

      const trimmedValue = value.trim();

      if (!trimmedValue) {
        this.$set(this.errors, fieldName, rule.message);
        return;
      }

      if (rule.minLength && trimmedValue.length < rule.minLength) {
        this.$set(this.errors, fieldName, `Minimum ${rule.minLength} characters required`);
        return;
      }

      if (rule.pattern && !rule.pattern.test(trimmedValue)) {
        this.$set(this.errors, fieldName, rule.patternMessage);
        return;
      }

      this.$set(this.errors, fieldName, '');
    },

    validateForm() {
      let isValid = true;
      
      Object.keys(this.formData).forEach(fieldName => {
        this.validateField(fieldName);
        if (this.errors[fieldName]) {
          isValid = false;
        }
      });

      return isValid;
    },

    async handleSubmit() {
      this.showAlert = false;

      if (this.validateForm()) {
        try {
          const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formData),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("User created:", result);
            this.showSuccessAlert("User registered successfully!");
            this.resetForm();
          } else {
            const errorData = await response.json();
            this.showErrorAlert(`Error: ${errorData.error || 'Failed to register user'}`);
          }
        } catch (error) {
          console.error("Network error:", error);
          this.showErrorAlert("Network error. Please make sure the server is running.");
        }
      } else {
        this.showErrorAlert("Please correct the errors in the form before submitting.");
      }
    },

    showSuccessAlert(message) {
      this.alertMessage = message;
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    },

    showErrorAlert(message) {
      this.alertMessage = message;
      this.alertType = 'error';
      this.showAlert = true;
    },

    hideAlert() {
      this.showAlert = false;
    },

    resetForm() {
      this.formData = {
        dni: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        ciudad: ''
      };
      this.errors = {};
    }
  }
}
</script>
