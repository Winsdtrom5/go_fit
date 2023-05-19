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
            <v-list-item-title class="headline">Data Instruktur</v-list-item-title>
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
            <v-icon v-if="item.status === 'Pending'" size="30" color="green" @click="editItem(item)"
              >mdi-check-decagram</v-icon
            >
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip color="green" dark v-if="item.status === 'Confirmed'">Confirmed</v-chip>
            <v-chip color="grey" dark v-else>{{ item.status }}</v-chip>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
              Are you sure you want to confirm izin of {{ itemToEdit ? ' ' + itemToEdit.nama : '' }}?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmDialog = false">No</v-btn>
            <v-btn color="green darken-1" text @click="editConfirmed">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmEdit" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data Pegawai </span>
          </v-card-title>
            <v-spacer></v-spacer>
        </v-card>
      </v-dialog>

        
      <v-dialog v-model="confirmDelete" persistent max-width="500px">
        <v-card class="accordion arrows">
          <br />
          <v-card-text style="color: black">
            <h1>Are you sure to delete?</h1>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green" text @click="hapus()"> YES </v-btn>
            <v-btn color="red" text @click="cancelDelete()"> NO </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    name: "PegawaiPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        confirmDelete: false,
        headers: [
          { text: "Nama Instruktur", value: "nama" },
          { text: "Tanggal Pengajuan", value: "tanggal_izin" },
          { text: "Nama Kelas", value: "nama_kelas" },
          { text: "Tanggal Kelas", value: "tanggal_kelas" },
          { text: "Alasan", value: "alasan" },
          { text: "Status", value: "status" },
          { text: "Actions", value: "actions" },
        ],
        filter:[
            '',
            'Confirmed',
            'Pending',
        ],
        todos: [],
        data: [], // Initialize data as an empty array
        formTodo: {
          id:null,
          nama: null,
          alasan:null,
          status: null,
          password: null,
        },
        itemToEdit: null,
        confirmDialog: false,
        selectedItem: '',
        jabatanOptions: [
          'Admin',
          'Kasir',
          'Manajer Operasional'
          // Add more options here as needed
        ]
      };
    },
    computed: {
      filteredTodos() {
        console.log(this.selectedItem);
        let filtered = this.todos;
        if (this.selectedItem) {
          filtered = filtered.filter(todo => {
            return todo.status === this.selectedItem;
          });
        }
        if (this.search) {
          filtered = filtered.filter(todo => {
            const searchTerm = this.search.toLowerCase();
            return todo.nama.toLowerCase().includes(searchTerm);
          });
        }
        return filtered;
      },
    },
    mounted() {
      this.getTrainee();
    },
    methods: {
      getTrainee() {
        axios
          .get("http://10.53.6.143/Server_Go_Fit/public/izininstruktur")
          .then((response) => {
            // this.todos = response.data.data;
            this.todos = response.data.data.filter(item => item.jabatan !== "Admin");
            console.log('response', this.todos);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      },
      cancel() {
        this.resetForm();
        this.dialog = false;
      },
      editItem(item) {
        this.itemToEdit = item;
        this.confirmDialog = true;
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
      editConfirmed() {
        axios.put('http://10.53.6.143/Server_Go_Fit/public/izininstruktur/' + this.itemToEdit.id)
          .then(response => {
            console.log(response.data);
            this.getTrainee();
            // window.location.reload();
          })
          .catch(error => {
            console.error(error);
          });
        this.confirmDialog = false;
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
  .confirmed {
    background-color: green;
  }
  </style>
  