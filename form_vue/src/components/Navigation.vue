<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#" @click="setCurrentView('create')">
        User Management
      </a>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: currentView === 'create' }"
              href="#" 
              @click="setCurrentView('create')"
            >
              Create User
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: currentView === 'list' }"
              href="#" 
              @click="setCurrentView('list')"
            >
              Users List
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  methods: {
    setCurrentView(view) {
      this.$emit('view-changed', view);
    }
  }
}
</script>