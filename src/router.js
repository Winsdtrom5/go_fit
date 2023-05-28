import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
  return () => import(`./components/${path}.vue`);
}

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "login",  
      component: importComponent("loginPage"),
    },

    {
      path: "/Admin/layout",
      name: "dashboardadmin",
      component: importComponent("Admin/layoutPage"),
      children: [
        {
          path: "/dashboardadmin",
          name: "index",
          component: importComponent("Admin/indexPage"),
          props: (route) => ({ username: route.query.username })
        },
        {
          path: "/instruktur",
          name: "Instruktur",
          component: importComponent("Admin/InstrukturPage"),
        },
        {
          path: "/pegawai",
          name: "Pegawai",
          component: importComponent("Admin/PegawaiPage"),
        },
        {
          path: "/promo",
          name: "Promo",
          component: importComponent("Admin/PromoPage"),
        },
      ],
    },

    {
      path: "/Kasir/layout",
      name: "dashboardkasir",
      component: importComponent("Kasir/layoutPage"),
      children: [
        {
          path: "/dashboardkasir",
          name: "index",
          component: importComponent("Kasir/indexPage"),
          props: (route) => ({ username: route.query.username })
        },
        {
          path: "/member",
          name: "Member",
          component: importComponent("Kasir/MemberPage"),
        },
        {
          path: "/presensigym",
          name: "Gym",
          component: importComponent("Kasir/GymPage"),
        },
        {
          path: "/presensikelas",
          name: "Kelas",
          component: importComponent("Kasir/KelasPage"),
        },
        {
          path: "/pembayaran",
          name: "Pembayaran",
          component: importComponent("Kasir/PembayaranPage"),
          props: (route) => ({ username: route.query.username })
        },
      ],
    },

    {
      path: "/MO/layout",
      name: "dashboardMO",
      component: importComponent("MO/layoutPage"),
      children: [
        {
          path: "/dashboardMO",
          name: "index",
          component: importComponent("MO/indexPage"),
          props: (route) => ({ username: route.query.username })
        },
        {
          path: "/kelas",
          name: "Kelas",
          component: importComponent("MO/kelasPage"),
        },
        {
          path: "/aktivitas",
          name: "aktivitas",
          component: importComponent("MO/aktivitaskelasPage"),
        },
        {
          path: "/pendapatan",
          name: "pendapatan",
          component: importComponent("MO/pendapatanPage"),
        },
        {
          path: "/izin",
          name: "izin",
          component: importComponent("MO/izininstrukturPage"),
        },
        {
          path: "/jadwalumum",
          name: "Jadwal Umum",
          component: importComponent("MO/jadwalumumPage"),
        },
        {
          path: "/jadwalharian",
          name: "Jadwal Harian",
          component: importComponent("MO/jadwalharianPage"),
        },
        {
          path: "/laporan",
          name: "Laporan",
          component: importComponent("MO/laporanPage"),
        },
        {
          path: "/ijininstruktur",
          name: "ijin Instruktur",
          component: importComponent("MO/ijininstrukturPage"),
        },
      ],
    },
  ],
});

export default router;
