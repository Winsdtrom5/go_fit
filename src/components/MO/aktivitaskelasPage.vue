<template>
    <v-app>
      <v-container>
        <v-card>
          <v-card-title>
            <h1 class="display-1">GoFit</h1>
            <h3>Jl. Centralpark No. 10 Yogyakarta</h3>
          </v-card-title>
          <v-card-text>
            <h2 class="display-2">LAPORAN AKTIVITAS KELAS BULANAN</h2>
            <h4>Bulan: Februari Tahun: 2023</h4>
            <h4>Tanggal cetak: 20 Februari 2023</h4>
  
            <v-data-table
              :headers="headers"
              :items="classActivities"
              hide-default-footer
              class="elevation-1"
            >
              <template item.kelas="{ item }">
                <strong>{{ item.kelas }}</strong>
              </template>
              <template item.instruktur="{ item }">
                {{ item.instruktur }}
              </template>
              <template item.jumlahPeserta="{ item }">
                {{ item.jumlahPeserta }}
              </template>
              <template item.jumlahLibur="{ item }">
                {{ item.jumlahLibur }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        headers: [
          { text: 'Kelas', value: 'kelas' },
          { text: 'Instruktur', value: 'instruktur' },
          { text: 'Jumlah Peserta', value: 'jumlahPeserta' },
          { text: 'Jumlah Libur', value: 'jumlahLibur' },
        ],
        data: [],
      };
    },
    methods: {
    openConfirmDialog(item) {
      this.itemToEdit = item;
      this.confirmDialog = true;
    },
    getTrainee() {
      axios
        .get("http://192.168.100.80/Server_Go_Fit/public/bookinggym")
        .then((response1) => {
          axios
            .get("http://192.168.100.80/Server_Go_Fit/public/presensigym")
            .then((response2) => {
              this.todos = [...response1.data.data, ...response2.data.data];
              console.log("todos", this.todos);
            })
            .catch((error) => {
              console.log(error.response.data);
            });
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
  };
  </script>
  
  <style>
  /* Add custom styles here */
  </style>
  