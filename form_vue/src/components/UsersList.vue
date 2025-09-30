<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card shadow">
          <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0">Users List</h3>
            <button @click="loadUsers" class="btn btn-light btn-sm">
              Refresh
            </button>
          </div>
          <div class="card-body">
            <div v-if="showAlert" :class="alertClass" class="alert alert-dismissible fade show" role="alert">
              <strong>{{ alertType === 'success' ? 'Success!' : 'Error!' }}</strong> {{ alertMessage }}
              <button type="button" class="btn-close" @click="hideAlert" aria-label="Close"></button>
            </div>

            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="users.length === 0" class="text-center text-muted py-4">
              <p>No users found</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
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
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.dni }}</td>
                    <td>{{ user.nombre }}</td>
                    <td>{{ user.apellido }}</td>
                    <td>{{ formatDate(user.fecha_nacimiento) }}</td>
                    <td>{{ capitalizeGender(user.genero) }}</td>
                    <td>{{ capitalizeCity(user.ciudad) }}</td>
                    <td>
                      <button @click="editUser(user)" class="btn btn-warning btn-sm me-2">
                        Edit
                      </button>
                      <button @click="deleteUser(user.dni)" class="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersList',
  data() {
    return {
      users: [],
      loading: false,
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
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:5000/users');
        if (response.ok) {
          this.users = await response.json();
        } else {
          this.showErrorAlert('Failed to load users');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        this.showErrorAlert('Network error. Please make sure the server is running.');
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(dni) {
      if (!confirm(`Are you sure you want to delete user with DNI: ${dni}?`)) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${dni}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.showSuccessAlert('User deleted successfully!');
          this.loadUsers();
          this.$emit('user-deleted');
        } else {
          const errorData = await response.json();
          this.showErrorAlert(`Error: ${errorData.error || 'Failed to delete user'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showErrorAlert('Network error. Please make sure the server is running.');
      }
    },

    editUser(user) {
      this.$emit('edit-user', user);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },

    capitalizeGender(gender) {
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    },

    capitalizeCity(city) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    },

    showSuccessAlert(message) {
      this.alertMessage = message;
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
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