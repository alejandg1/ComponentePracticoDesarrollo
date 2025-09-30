<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-header bg-warning text-white">
            <h3 class="card-title mb-0">Edit User</h3>
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
                  v-model="searchDni"
                  @input="validateField('searchDni')"
                  :class="['form-control', { 'is-invalid': errors.searchDni }]"
                  :disabled="userFound"
                  placeholder="Enter DNI to search"
                />
                <div v-if="errors.searchDni" class="invalid-feedback">
                  <span>{{ errors.searchDni }}</span>
                </div>
                <button 
                  v-if="!userFound" 
                  @click="searchUser" 
                  type="button" 
                  class="btn btn-primary mt-2"
                  :disabled="!searchDni || errors.searchDni"
                >
                  Search User
                </button>
              </div>

              <div v-if="userFound">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    v-model="formData.nombre"
                    @input="validateField('nombre')"
                    :class="['form-control', { 'is-invalid': errors.nombre }]"
                  />
                  <div v-if="errors.nombre" class="invalid-feedback">
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
                  <div v-if="errors.apellido" class="invalid-feedback">
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
                  <div v-if="errors.fecha_nacimiento" class="invalid-feedback">
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
                  <div v-if="errors.genero" class="invalid-feedback d-flex">
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
                  <div v-if="errors.ciudad" class="invalid-feedback">
                    <span>{{ errors.ciudad }}</span>
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-warning btn-lg">
                    Update User
                  </button>
                  <button @click="resetForm" type="button" class="btn btn-secondary">
                    Reset Form
                  </button>
                </div>
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
  name: 'EditUser',
  data() {
    return {
      searchDni: '',
      userFound: false,
      formData: {
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
        searchDni: {
          message: "DNI is required",
          pattern: /^\d{10}[A-Za-z]$/,
          patternMessage: "DNI must be 10 digits followed by a letter"
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
      let value;
      if (fieldName === 'searchDni') {
        value = this.searchDni;
      } else {
        value = this.formData[fieldName];
      }
      
      const rule = this.rules[fieldName];
      
      if (!rule) {
        this.$set(this.errors, fieldName, '');
        return;
      }

      const trimmedValue = value ? value.toString().trim() : '';

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

    async searchUser() {
      if (!this.searchDni || this.errors.searchDni) return;

      try {
        const response = await fetch(`http://localhost:5000/users`);
        if (response.ok) {
          const users = await response.json();
          const user = users.find(u => u.dni === this.searchDni);
          
          if (user) {
            this.formData = {
              nombre: user.nombre,
              apellido: user.apellido,
              fecha_nacimiento: user.fecha_nacimiento.split('T')[0],
              genero: user.genero,
              ciudad: user.ciudad
            };
            this.userFound = true;
            this.showSuccessAlert('User found! You can now edit the details.');
          } else {
            this.showErrorAlert('User not found with this DNI.');
          }
        }
      } catch (error) {
        console.error('Error searching user:', error);
        this.showErrorAlert('Network error. Please make sure the server is running.');
      }
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
          const response = await fetch(`http://localhost:5000/users/${this.searchDni}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formData),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("User updated:", result);
            this.showSuccessAlert("User updated successfully!");
          } else {
            const errorData = await response.json();
            this.showErrorAlert(`Error: ${errorData.error || 'Failed to update user'}`);
          }
        } catch (error) {
          console.error("Network error:", error);
          this.showErrorAlert("Network error. Please make sure the server is running.");
        }
      } else {
        this.showErrorAlert("Please correct the errors in the form before submitting.");
      }
    },

    resetForm() {
      this.searchDni = '';
      this.userFound = false;
      this.formData = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        genero: '',
        ciudad: ''
      };
      this.errors = {};
      this.showAlert = false;
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
    }
  }
}
</script>