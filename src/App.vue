<template>
  <template v-if="appLoadingStatus">
    <AppSkeleton />
  </template>

  <template v-else>
    <div id="nav" class="mb-12">
      <NavBar />
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="mx-auto text-center max-w-7xl">
      <router-view />
    </div>
  </template>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import AppSkeleton from "./components/skeletons/AppSkeleton.vue";
import useAuth from "./composables/auth";
export default {
  components: {
    NavBar,
    AppSkeleton,
  },
  setup() {
    const { auth, appLoadingStatus } = useAuth();

    auth("getUser");

    return {
      appLoadingStatus,
    };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: blue;
}
</style>
