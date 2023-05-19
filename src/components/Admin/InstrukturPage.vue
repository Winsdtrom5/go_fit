<template>
    <v-main class="list">
      <v-card>
        <v-list-item>
          <v-list-item-avatar>
            <img
              src="https://m.media-amazon.com/images/I/51QLt5H+9TL._AC_UF1000,1000_QL80_.jpg"
              alt="ambasing"
          /></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">Data Instruktur</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search by Nama Instruktur"
            outlined
            hide-details
            style="margin-top: 30px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="brown" dark @click="dialog = true" class="mr-3">Tambah Instruktur</v-btn>
          <v-btn color="brown" dark @click="resetItem(item)" class="ml-3">Reset Keterlambatan</v-btn>
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
            <v-icon size="30" color="brown" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
            <v-icon size="30" color="brown" @click="deleteItem(item)"
              >mdi-trash-can</v-icon
            >
            <v-toast ref="toast"></v-toast>
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog v-model="confirmEdit" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data instruktur </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama"
                label="Nama instruktur"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.password"
                label="Password instruktur"
                required
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="formTodo.umur"
                label="Umur instruktur"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="Nomor Telepon"
                required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveupdate"> Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

        
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
              Are you sure you want to Reset Keterlambatan This Month ?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmDialog = false">No</v-btn>
            <v-btn color="green darken-1" text @click="editConfirmed">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data instruktur </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama"
                label="Nama instruktur"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.password"
                label="Password instruktur"
                required
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="formTodo.umur"
                label="Umur Instruktur"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="no_telp"
                required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </template>
  <script>
  import axios from 'axios'
  import { createToastInterface } from "vue-toastification";
  export default {
    name: "PromoPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        itemToDelete: null,
        confirmDelete: false,
        headers: [
          { text: "Nama Instruktur", value: "nama" },
          { text: "Umur", value: "umur" },
          { text: "Nomor Telepon", value: "no_telp" },
          { text: "Total Keterlambatan", value: "keterlambatan" },
          { text: "Actions", value: "actions" },
        ],
        todos: [],
        data: [], // Initialize data as an empty array
        formTodo: {
          id_instruktur:null,
          nama: null,
          umur: null,
          no_telp:null,
          keterlambatan:null,
        },
        itemToEdit: null,
        confirmDialog: false,
      };
    },
    mounted() {
      this.getTrainee();
    },
    computed: {
      filteredTodos() {
        if (this.search) {
          return this.todos.filter((todo) =>
            todo.nama.toLowerCase().includes(this.search.toLowerCase())
          );
        }
        return this.todos;
      },
    },
    methods: {
      saveupdate() {
        if (!this.formTodo.nama || !this.formTodo.password || !this.formTodo.umur || !this.formTodo.no_telp) {
          let toast = createToastInterface();
          toast.error("Please Fill All The Attribute", {
            timeout: 2000
          });
          return;
        }
        let today = new Date();
        let nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        axios.put(`http:///Server_Go_Fit/public/instruktur/${this.formTodo.id_instruktur}`, {
            id_instruktur:this.formTodo.id_instruktur,
            nama: this.formTodo.nama,
            password: this.formTodo.password,
            umur: this.formTodo.umur,
            no_telp: this.formTodo.no_telp,
        })
        .then(response => {
            console.log("Edit instruktur success");
            console.log('response password', this.formTodo.password);
            console.log("Link", `http:///Server_Go_Fit/public/instruktur/${this.formTodo.id_instruktur}`);
            // router.push('/dashboardkasir')
            console.log(response.data);
            window.location.reload(); // Refresh the page
        })
        .catch(error => {
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response data:", error.response.data);
                if (error.response.data.error === 'PasswordRequired') {
                    console.log("Password is required");
                    // Display an error message to the user
                }
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Error occurred:", error.message);    
            }
            console.log("Error",this.formTodo)
        });
        this.confirmEdit = false;
        // this.getTrainee();
      },
      getTrainee() {
        axios
          .get("http://10.53.6.143/Server_Go_Fit/public/instruktur")
          .then((response) => {
            // this.todos = response.data.data;
            this.todos = response.data.data;
            console.log('response', this.allData);
            let toast = createToastInterface();
          toast.success("Show Data Success !", {
            timeout: 2000
          });
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      },
      save() {
        if (!this.formTodo.nama || !this.formTodo.password || !this.formTodo.umur || !this.formTodo.no_telp) {
          let toast = createToastInterface();
          toast.error("Please Fill All The Attribute", {
            timeout: 2000
          });
          return;
        }
        let formTodo = new FormData();
        formTodo.append('nama', this.formTodo.nama);
        formTodo.append('password', this.formTodo.password);
        formTodo.append('umur', this.formTodo.umur);
        formTodo.append('no_telp', this.formTodo.no_telp);
        axios.post('http://10.53.6.143/Server_Go_Fit/public/instruktur', formTodo)
          .then(response => {
            // Handle successful response
            console.log(response.data);
            this.resetForm();
            this.dialog = false;
            this.getTrainee();
            // Do something with the response data, e.g. show success message
          })
          .catch(error => {
            // Handle error response
            console.error(error);
            // Do something with the error, e.g. show error message
          });
      },
      cancel() {
        this.resetForm();
        this.dialog = false;
      },
      editItem(item) {
        this.edit = item;
        this.formTodo.id_instruktur = item.id_instruktur;
        this.formTodo.password = item.password;
        this.formTodo.nama = item.nama;
        this.formTodo.umur = item.umur;
        this.formTodo.no_telp = item.no_telp;
        this.confirmEdit = true;
      },
      resetItem(item){
        this.itemToEdit = item;
        this.confirmDialog = true;
      },
      editConfirmed() {
        axios.put('http://10.53.6.143/Server_Go_Fit/public/instruktur/reset')
          .then(response => {
            console.log(response.data);
            console.log('http://10.53.6.143/Server_Go_Fit/public/instruktur/reset')
            let toast = createToastInterface();
            toast.success("Reset Keterlambatan successful", {
              timeout: 2000
            });
            setTimeout(() => {
              this.getTrainee();
            }, 2000);
            // window.location.reload();
          })
          .catch(error => {
            console.error(error);
          });
        this.confirmDialog = false;
      },
      update() {
        axios.put(`http://10.53.6.143/Server_Go_Fit/public/instruktur/${this.formTodo.id_instruktur}`, {
            id_instruktur:this.formTodo.id_instruktur,
            nama_instruktur: this.formTodo.nama,
            password: this.formTodo.password,
            umur: this.formTodo.umur,
            no_telp: this.formTodo.no_telp,
        })
        .then(response => {
            console.log("Edit instruktur success");
            console.log('response password', this.formTodo.password);
            console.log("Link", `http://10.53.6.143/Server_Go_Fit/public/instruktur/${this.formTodo.id_instruktur}`);
            // router.push('/dashboardkasir')
            console.log(response.data);
            window.location.reload(); // Refresh the page
        })
        .catch(error => {
            if (error.response) {
                console.log("Error response status:", error.response.status);
                console.log("Error response data:", error.response.data);
                if (error.response.data.error === 'PasswordRequired') {
                    console.log("Password is required");
                    // Display an error message to the user
                }
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Error occurred:", error.message);    
            }
            console.log("Error",this.formTodo)
        });
        this.confirmEdit = false;
        // this.getTrainee();
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
        axios.delete(`http://10.53.6.143/Server_Go_Fit/public/instruktur/${item.id_instruktur}`)
        console.log(item.id_instruktur)
        window.location.reload();
      },
      resetForm() {
        this.formTodo = {
          id_instruktur:null,
          nama: null,
          umur: null,
          no_telp:null,
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
  