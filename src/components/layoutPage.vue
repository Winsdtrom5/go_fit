<template>
  <div class="dashboard">
    <v-navigation-drawer class="fullheight" width="256" v-model="drawer" absolute temporary color="brown">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <br>
            LAYANAN HOTEL GAWO
          </v-list-item-title>
          <!-- <v-list-item-subtitle><br>Untuk Anda</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
      <br>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" Link color="white" tag="router-link" :to="item.to">
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
      items: [
        { title: "Dashboard", to: "/dashboard" },
        { title: "Akun", to: "/akun" },
        { title: "Reservasi", to: "/reservasi" },
        { title: "Layanan Menu", to: "/layananUser" },
        { title: "Keluar", to: "/"},
      ],
    };
  },
  methods: {
    keluar(){
      // console.warn("keluar")
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
  