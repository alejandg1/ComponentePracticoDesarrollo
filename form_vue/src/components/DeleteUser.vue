<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-danger text-white">
            <h3 class="card-title mb-0">Delete User</h3>
          </div>
          <div class="card-body">
            <div v-if="showAlert" :class="alertClass" class="alert alert-dismissible fade show" role="alert">
              <strong>{{ alertType === 'success' ? 'Success!' : 'Error!' }}</strong> {{ alertMessage }}
              <button type="button" class="btn-close" @click="hideAlert" aria-label="Close"></button>
            </div>

            <div v-if="!userFound">
              <div class="mb-3">
                <label class="form-label">Enter DNI to delete user</label>
                <input
                  type="text"
                  v-model="searchDni"
                  @input="validateDni"
                  :class="['form-control', { 'is-invalid': dniError }]"
                  placeholder="Enter DNI (e.g., 12345678A)"
                />
                <div v-if="dniError" class="invalid-feedback">
                  <span>{{ dniError }}</span>
                </div>
              </div>
              <button 
                @click="searchUser" 
                class="btn btn-primary"
                :disabled="!searchDni || dniError"
              >
                Search User
              </button>
            </div>

            <div v-else class="text-center">
              <div class="alert alert-warning">
                <h5>User Found!</h5>
                <p><strong>DNI:</strong> {{ userToDelete.dni }}</p>
                <p><strong>Name:</strong> {{ userToDelete.nombre }} {{ userToDelete.apellido }}</p>
                <p><strong>City:</strong> {{ capitalizeCity(userToDelete.ciudad) }}</p>
              </div>

              <div class="alert alert-danger">
                <h6>️ Warning</h6>
                <p>This action cannot be undone. Are you sure you want to delete this user?</p>
              </div>

              <div class="d-grid gap-2">
                <button @click="confirmDelete" class="btn btn-danger btn-lg">
                  Yes, Delete User
                </button>
                <button @click="cancelDelete" class="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteUser',
  data() {
    return {
      searchDni: '',
      userFound: false,
      userToDelete: null,
      dniError: '',
      showAlert: false,
      alertMessage: '',
      alertType: 'success'
    }
  },
  computed: {
    alertClass() {
      return this.alertType === 'success' ? 'alert-success' : 'alert-danger';
    }
  },
  methods: {
    validateDni() {
      const dniPattern = /^\d{8}[A-Za-z]$/;
      
      if (!this.searchDni.trim()) {
        this.dniError = 'DNI is required';
        return;
      }

      if (!dniPattern.test(this.searchDni.trim())) {
        this.dniError = 'DNI must be 8 digits followed by a letter';
        return;
      }

      this.dniError = '';
    },

    async searchUser() {
      if (!this.searchDni || this.dniError) return;

      try {
        const response = await fetch(`http://localhost:5000/users`);
        if (response.ok) {
          const users = await response.json();
          const user = users.find(u => u.dni === this.searchDni);
          
          if (user) {
            this.userToDelete = user;
            this.userFound = true;
          } else {
            this.showErrorAlert('User not found with this DNI.');
          }
        }
      } catch (error) {
        console.error('Error searching user:', error);
        this.showErrorAlert('Network error. Please make sure the server is running.');
      }
    },

    async confirmDelete() {
      try {
        const response = await fetch(`http://localhost:5000/users/${this.userToDelete.dni}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.showSuccessAlert('User deleted successfully!');
          this.resetForm();
        } else {
          const errorData = await response.json();
          this.showErrorAlert(`Error: ${errorData.error || 'Failed to delete user'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showErrorAlert('Network error. Please make sure the server is running.');
      }
    },

    cancelDelete() {
      this.resetForm();
    },

    resetForm() {
      this.searchDni = '';
      this.userFound = false;
      this.userToDelete = null;
      this.dniError = '';
    },

    capitalizeCity(city) {
      return city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
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