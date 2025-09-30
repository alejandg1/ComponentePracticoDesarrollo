<template>
  <div>
    <Navigation 
      :currentView="currentView" 
      @view-changed="handleViewChange"
    />
    
    <main>
      <CreateUser v-if="currentView === 'create'" />
      <UsersList 
        v-if="currentView === 'list'" 
        ref="usersList"
        @edit-user="handleEditUser"
        @user-deleted="handleUserDeleted"
      />
    </main>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <EditUserInline 
              :user="userToEdit" 
              @user-updated="handleUserUpdated"
              @cancel="showEditModal = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
import CreateUser from './CreateUser.vue'
import UsersList from './UsersList.vue'
import EditUserInline from './EditUserInline.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    CreateUser,
    UsersList,
    EditUserInline
  },
  data() {
    return {
      currentView: 'create',
      userToEdit: null,
      showEditModal: false
    }
  },
  methods: {
    handleViewChange(view) {
      this.currentView = view;
      this.showEditModal = false;
      this.userToEdit = null;
    },
    
    handleEditUser(user) {
      this.userToEdit = user;
      this.showEditModal = true;
    },
    
    handleUserUpdated() {
      this.showEditModal = false;
      this.userToEdit = null;
      if (this.$refs.usersList) {
        this.$refs.usersList.loadUsers();
      }
    },
    
    handleUserDeleted() {
      if (this.$refs.usersList) {
        this.$refs.usersList.loadUsers();
      }
    }
  }
}
</script>
