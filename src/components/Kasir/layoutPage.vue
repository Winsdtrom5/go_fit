<template>
  <div class="dashboard">
    <v-navigation-drawer class="fullheight" width="256" v-model="drawer" absolute temporary color="brown">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <br>
            Kasir Page
          </v-list-item-title>
          <v-list-item-subtitle>
            <br>
            {{ username }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <br>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="(item, index) in menuItems" :key="index" Link color="white" tag="router-link" :to="item.to">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="brown" dark>
      <v-app-bar-nav-icon @click="drawer = true" color="white"></v-app-bar-nav-icon>
      <Vspacer />
    </v-app-bar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "layoutPage",
  data() {
    return {
      drawer: false,
      group: null,
      username: null,
    };
  },
  computed: {
    menuItems() {
      return [
        { 
          title: "Dashboard", 
          to: `/dashboardkasir?username=${this.username || ''}` 
        },
        { title: "Member", to: "/member" },
        { title: "Presensi", to: "/presensi" },  
        { title: "Pembayaran", to: "/pembayaran" },
        { title: "Keluar", to: "/"},
      ];
    },
  },
  mounted() {
    // Get username from the URL
    const username = this.$route.query.username;
    this.username = username;
  },
  methods: {
    keluar(){
      localStorage.clear();
      this.$router.push( {name : 'login'})
    }
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}
</style>
