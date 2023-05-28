<template>
  <v-main class="list">
    <v-card>
      <v-list-item>
        <v-list-item-avatar>
          <img
            src="https://m.media-amazon.com/images/I/51QLt5H+9TL._AC_UF1000,1000_QL80_.jpg"
            alt="ambasing"
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline"
            >Data Kelas Member</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              outlined
              hide
              details
              style="margin-top: 30px"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedItem"
              :items="filter"
              label="Filter"
              outlined
              hide-details
              style="margin-top: 30px"
            ></v-select>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredTodos"
        :search="search"
        item-key="desert"
        show-expand
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon size="30" color="brown" @click="printItem(item)"
            >mdi-cloud-print</v-icon
          >
        </template>
      </v-data-table>
    </v-card>
  </v-main>
</template>

<script>
import axios from "axios";
import { createToastInterface } from "vue-toastification";
// import jsPDF from "jspdf";
export default {
  name: "PegawaiPage",
  data() {
    return {
      search: null,
      dialog: false,
      confirmEdit: false,
      confirmDelete: false,
      headers: [
        { text: "Nama Member", value: "nama_member" },
        { text: "Nama Kelas", value: "nama_kelas" },
        { text: "Tanggal", value: "tanggal_kelas" },
        { text: "Status", value: "status" },
        { text: "Jenis", value: "jenis" },
        { text: "Actions", value: "actions" },
      ],
      todos: [],
      data: [], // Initialize data as an empty array
      formTodo: {
        nama_member: null,
        tanggal: null,
        jam_keluar: null,
        jam_masuk: null,
        status: null,
      },
      filter: ["", "Presensi", "Booking"],
      itemToEdit: null,
      selectedItem: "",
      confirmDialog: false, // Move confirmDialog inside the data() method
    };
  },
  computed: {
    filteredTodos() {
      let filtered = this.todos;
      if (this.selectedItem === "Presensi") {
        filtered = filtered.filter((todo) => {
          return todo.status != null;
        });
      }
      if (this.selectedItem === "Booking") {
        filtered = filtered.filter((todo) => {
          return todo.status == null;
        });
      }
      if (this.search) {
        filtered = filtered.filter((todo) => {
          const searchTerm = this.search.toLowerCase();
          return todo.nama_member.toLowerCase().includes(searchTerm);
        });
      }
      return filtered;
    },
  },
  mounted() {
    this.getTrainee();
  },
  methods: {
    openConfirmDialog(item) {
      this.itemToEdit = item;
      this.confirmDialog = true;
    },
    getTrainee() {
      axios
        .get("http://192.168.100.80/Server_Go_Fit/public/presensikelas")
        .then((response) => {
          this.todos = response.data.data;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    cancel() {
      this.resetForm();
      this.dialog = false;
    },
    confirmpresensi(item) {
      axios
        .get(
          "http://192.168.100.80/Server_Go_Fit/public/presensikelas/" +
            item.nama_member +
            "/" +
            item.tanggal +
            "/" +
            item.jam_masuk +
            "/" +
            item.jam_keluar
        )
        .then((response) => {
          if (response.data.data) {
            let toast = createToastInterface();
            toast.error("Sudah Melakukan Presensi", {
              timeout: 2000,
            });
          } else {
            this.itemToEdit = item;
            this.confirmDialog = true; // Set confirmDialog to true to show the dialog
          }
        })
        .catch((error) => {
          console.error(error);
          this.itemToEdit = item;
          this.confirmDialog = true; // Set confirmDialog to true to show the dialog
        });
    },
    printItem(item) {
      let nama_member = item.nama_member;
      axios
        .get("http://192.168.100.80/Server_Go_Fit/public/member")
        .then((response) => {
          // filter the response data to find the member with matching nama_member
          const matchingMember = response.data.data.filter(
            (member) => member.nama_member === item.nama_member
          )[0];
          let id_member = matchingMember.id_member;
          let date_daftar = matchingMember.date_daftar;
          let year2 = date_daftar.substr(2, 2);
          let month2 = date_daftar.substr(5, 2);
          let nomorMember = year2 + "." + month2 + "." + id_member;
          let deposituang = matchingMember.deposit_uang;
          let depositkelas = matchingMember.deposit_kelas;
          let berlaku = matchingMember.batas_berlaku;
          axios
            .get("http://192.168.100.80/Server_Go_Fit/public/presensikelas")
            .then((response) => {
              let data = response.data.data;
              let latestID = 0;
              data.forEach((item) => {
                const itemID = parseInt(item.id);
                if (item.nama_member == nama_member) {
                  if (itemID > latestID) {
                    latestID = itemID;
                  }
                }
              });
              const matchingpresensi = response.data.data.filter(
                (presensikelas) => presensikelas.id == latestID
              )[0];
              console.log(matchingMember)
              axios
                .get(`http://192.168.100.80/Server_Go_Fit/public/bookingkelas`)
                .then((response) => {
                  const matchingbooking = response.data.data.filter(
                    (bookingkelas) =>
                      bookingkelas.id === matchingpresensi.id_booking
                  )[0];
                  let tarif = matchingbooking.tarif;
                  let instruktur = matchingbooking.nama;
                  let kelas = matchingbooking.nama_kelas;
                  const now = new Date();
                  const year = now.getFullYear().toString().substr(-2);
                  const month = ("0" + (now.getMonth() + 1)).slice(-2);
                  const day = ("0" + now.getDate()).slice(-2);
                  const hours = ("0" + now.getHours()).slice(-2);
                  const minutes = ("0" + now.getMinutes()).slice(-2);
                  const fullYear = now.getFullYear().toString();
                  const currentDate = `${day}/${month}/${fullYear}`;
                  const currentTime = `${hours}:${minutes}`;
                  const noStruk = `${year}.${month}.${latestID}`;
                  if (item.jenis == 'paket') {
                    const printContents = `
                        <div style="border: 1px solid black; padding: 10px;">
                            <div>
                                <h2>GoFit</h2>
                                <p>Jl. Centralpark No. 10 Yogyakarta</p>
                            </div>
                            <br>
                            <div style="margin-top: 20px;">
                            <h3>STRUK PRESENSI KELAS PAKET</h3>
                                <p>No Struk  : ${noStruk}</p>
                                <p>Tanggal   : ${currentDate} ${currentTime}</p>
                            </div>
                            <br>
                            <div style="margin-top: 20px;">
                                <p>Member       : ${nomorMember} / ${item.nama_member}</p>
                                <p>Kelas        : ${kelas}</p>
                                <p>Instruktur   : ${instruktur}</p>
                                <p>Sisa Deposit : ${depositkelas}</p>
                                <p>Batas Berlaku: ${berlaku}</p>
                            </div>
                            </div>
                        </div>
                        `;
                    let toast = createToastInterface();
                    toast.success("Printing Struk Presensi Paket", {
                      timeout: 2000,
                    });
                    setTimeout(() => {
                      const popup = window.open("", "_blank");
                      popup.document.write(printContents);
                      popup.document.close();
                      popup.focus();
                      popup.print();
                      // popup.close();
                    }, 2000);
                  } else {
                    const printContents = `
                        <div style="border: 1px solid black; padding: 10px;">
                            <div>
                                <h2>GoFit</h2>
                                <p>Jl. Centralpark No. 10 Yogyakarta</p>
                            </div>
                            <br>
                            <div style="margin-top: 20px;">
                                <h3>STRUK PRESENSI KELAS REGULER</h3>
                                <p>No Struk     : ${noStruk}</p>
                                <p>Tanggal      : ${currentDate} ${currentTime}</p>
                            </div>
                            <br>
                            <div style="margin-top: 20px;">
                                <p>Member       : ${nomorMember} / ${item.nama_member}</p>
                                <p>Kelas        : ${kelas}</p>
                                <p>Instruktur   : ${instruktur}</p>
                                <p>Tarif        : ${tarif}</p>
                                <p>Sisa Deposit : ${deposituang}</p>
                            </div>
                        </div>
                        `;
                    let toast = createToastInterface();
                    toast.success("Printing Struk Presensi Reguler", {
                      timeout: 2000,
                    });
                    setTimeout(() => {
                      const popup = window.open("", "_blank");
                      popup.document.write(printContents);
                      popup.document.close();
                      popup.focus();
                      popup.print();
                      // popup.close();
                    }, 2000);
                  }
                });
            });
        });
    },
    savepresensi() {
      let formTodo = new FormData();
      console.log(this.itemToEdit.nama_member);
      formTodo.append("nama_member", this.itemToEdit.nama_member);
      formTodo.append("tanggal", this.itemToEdit.tanggal);
      formTodo.append("jam_masuk", this.itemToEdit.jam_masuk);
      formTodo.append("jam_keluar", this.itemToEdit.jam_keluar);
      formTodo.append("status", "Hadir");
      axios
        .post("http://192.168.100.80/Server_Go_Fit/public/presensigym", formTodo)
        .then((response) => {
          // Handle successful response
          let toast = createToastInterface();
          toast.success("Konfirmasi Berhasil", {
            timeout: 2000,
          });
          console.log(response.data);
          this.confirmDialog = false;
          this.getTrainee();
          // Do something with the response data, e.g. show success message
        })
        .catch((error) => {
          // Handle error response
          console.error(error);
          // Do something with the error, e.g. show error message
        });
    },
    cancelUpdate() {
      this.resetForm();
      this.confirmEdit = false;
    },
    hapus() {
      const index = this.todos.indexOf(this.delete);
      this.todos.splice(index, 1);
      this.confirmDelete = false;
    },
    cancelDelete() {
      this.confirmDelete = false;
    },
    deleteItem(item) {
      this.delete = item;
      this.confirmDelete = true;
    },
    resetForm() {
      this.formTodo = {
        nama_pegawai: null,
        umur: null,
        // tanggal_masuk: null,
        // tanggal_keluar: null,
        no_telp: null,
        jabatan: null,
      };
    },
  },
};
</script>
<style>
.text {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  font-size: 40px;
  font-style: italic;
}
</style>
