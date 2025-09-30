<template>
  <div>
    <div v-if="showAlert" :class="alertClass" class="alert alert-dismissible fade show" role="alert">
      <strong>{{ alertType === 'success' ? 'Success!' : 'Error!' }}</strong> {{ alertMessage }}
      <button type="button" class="btn-close" @click="hideAlert" aria-label="Close"></button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">DNI</label>
            <input
              type="text"
              :value="user.dni"
              class="form-control"
              disabled
            />
          </div>
        </div>
        <div class="col-md-6">
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
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
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
        </div>
        <div class="col-md-6">
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
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Gender</label>
            <div>
              <div class="form-check form-check-inline">
                <input
                  type="radio"
                  value="male"
                  v-model="formData.genero"
                  @change="validateField('genero')"
                  class="form-check-input"
                  id="modal-gender-male"
                />
                <label class="form-check-label" for="modal-gender-male">Male</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  type="radio"
                  value="female"
                  v-model="formData.genero"
                  @change="validateField('genero')"
                  class="form-check-input"
                  id="modal-gender-female"
                />
                <label class="form-check-label" for="modal-gender-female">Female</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  type="radio"
                  value="other"
                  v-model="formData.genero"
                  @change="validateField('genero')"
                  class="form-check-input"
                  id="modal-gender-other"
                />
                <label class="form-check-label" for="modal-gender-other">Other</label>
              </div>
            </div>
            <div v-if="errors.genero" class="text-danger small">
              <span>{{ errors.genero }}</span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
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
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-end">
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Update User
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditUserInline',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.formData = {
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            fecha_nacimiento: newUser.fecha_nacimiento ? newUser.fecha_nacimiento.split('T')[0] : '',
            genero: newUser.genero,
            ciudad: newUser.ciudad
          };
        }
      },
      immediate: true
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

      const trimmedValue = value ? value.toString().trim() : '';

      if (!trimmedValue) {
        this.$set(this.errors, fieldName, rule.message);
        return;
      }

      if (rule.minLength && trimmedValue.length < rule.minLength) {
        this.$set(this.errors, fieldName, `Minimum ${rule.minLength} characters required`);
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
          const response = await fetch(`http://localhost:5000/users/${this.user.dni}`, {
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
            setTimeout(() => {
              this.$emit('user-updated');
            }, 1500);
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

    showSuccessAlert(message) {
      this.alertMessage = message;
      this.alertType = 'success';
      this.showAlert = true;
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