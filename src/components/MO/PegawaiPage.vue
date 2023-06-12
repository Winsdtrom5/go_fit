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
            <v-list-item-title class="headline">Data Pegawai</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            outlined
            hide
            details
            style="margin-top: 30px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="brown" dark @click="dialog = true"> Tambah Pegawai </v-btn>
        </v-card-title>
      </v-card>
  
      <v-card>
        <v-data-table
          :headers="headers"
          :items="todos"
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
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog v-model="confirmEdit" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data Pegawai </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_pegawai"
                label="Nama pegawai"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.umur"
                label="Umur Pegawai"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="Nomor Telepon"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.jabatan"
                label="Jabatan"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.password"
                label="Password"
                required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >    
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
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

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data Pegawai </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_pegawai"
                label="Nama pegawai"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.umur"
                label="Umur Pegawai"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="no_telp"
                required
              ></v-text-field>
              <v-select
                v-model="formTodo.jabatan"
                :items="jabatanOptions"
                label="Jabatan"
                required
              ></v-select>
              <v-text-field
                v-model="formTodo.password"
                label="Password"
                required
                type="password"
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
  import { router } from '../../router'
  import axios from 'axios'
  import { createToastInterface } from "vue-toastification";
  export default {
    name: "PegawaiPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        confirmDelete: false,
        headers: [
          { text: "Nama Pegawai", value: "nama_pegawai" },
          { text: "Umur", value: "umur" },
          // { text: "Tanggal Check-in", value: "tanggal_masuk" },
          // { text: "Tanggal Check-out", value: "tanggal_keluar" },
          { text: "Nomor Telepon", value: "no_telp" },
          { text: "Jabatan", value: "jabatan" },
          { text: "Actions", value: "actions" },
        ],
        todos: [],
        data: [], // Initialize data as an empty array
        formTodo: {
          id_pegawai:null,
          nama_pegawai: null,
          umur: null,
          no_telp:null,
          jabatan: null,
          password: null,
          // tanggal_keluar: null,
          // no_telp: null,
          // jabatan: null,
          // delete: null,
          // edit: null,
        },
        jabatanOptions: [
          'Admin',
          'Kasir',
          'Manajer Operasional'
          // Add more options here as needed
        ]
      };
    },
    mounted() {
      this.getTrainee();
    },
    methods: {
      getTrainee() {
        axios
          .get("https://gofit123.xyz/Server_Go_Fit/public/pegawai")
          .then((response) => {
            // this.todos = response.data.data;
            this.todos = response.data.data.filter(item => item.jabatan !== "Admin");
            console.log('response', this.todos);
            let toast = createToastInterface();
            toast.success("Show Data Success !", {
              timeout: 2000
            });
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      },
      updateItem() {
      // Perform the update operation here, e.g., make an API call to update the todo on the server
 // Perform the update operation here, e.g., make an API call to update the todo on the server
        const updatedTodo = {
        // Extract the fields you want to update from the editedTodo data property
        nama_pegawai: this.editedTodo.nama_pegawai,
        umur: this.editedTodo.umur,
        no_telp: this.editedTodo.no_telp,
        jabatan: this.editedTodo.jabatan,
        password: this.editedTodo.password
      };

      // Make API call to update todo
      axios.put(`https://gofit123.xyz/Server_Go_Fit/public/pegawai/${this.editedTodo.id_pegawai}`, updatedTodo)
        .then(response => {
          // Update the todos array with the updated todo received from the server
          const todoIndex = this.todos.findIndex(todo => todo.id === this.editedTodo.id);
          this.todos[todoIndex] = response.data;
          
          // After the update is successful, close the edit dialog and reset the editedTodo data property
          this.dialog = false;
          this.editedTodo = null;
        })
        .catch(error => {
          console.error('Error updating todo:', error);
        });
      // After the update is successful, close the edit dialog and reset the editedTodo data property
        this.dialog = false;
        this.editedTodo = null;
      },
      save() {
      // Create a FormData object to hold the form data
        let formTodo = new FormData();
        formTodo.append('nama_pegawai', this.formTodo.nama_pegawai);
        formTodo.append('password', this.formTodo.password);
        formTodo.append('umur', this.formTodo.umur);
        formTodo.append('no_telp', this.formTodo.no_telp);
        formTodo.append('jabatan', this.formTodo.jabatan);

        // Send a POST request to the backend API
        axios.post('https://gofit123.xyz/Server_Go_Fit/public/pegawai', formTodo)
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
        this.formTodo.id_pegawai = item.id_pegawai;
        this.formTodo.nama_pegawai = item.nama_pegawai;
        this.formTodo.umur = item.umur;
        // this.formTodo.tanggal_masuk = item.tanggal_masuk;
        // this.formTodo.tanggal_keluar = item.tanggal_keluar;
        this.formTodo.no_telp = item.no_telp;
        this.formTodo.jabatan = item.jabatan;
        this.formTodo.password = item.password;
        this.confirmEdit = true;
      },

      update() {
        this.edit.nama_pegawai = this.formTodo.nama_pegawai;
        this.edit.umur = this.formTodo.umur;
        // this.edit.tanggal_masuk = this.formTodo.tanggal_masuk;
        // this.edit.tanggal_keluar = this.formTodo.tanggal_keluar;
        this.edit.no_telp = this.formTodo.no_telp;
        this.edit.jabatan = this.formTodo.jabatan;
        axios.put('https://gofit123.xyz/Server_Go_Fit/public/pegawai/', {
          nama_pegawai: this.edit.nama_pegawai,
          umur: this.edit.umur,
          // tanggal_masuk: this.edit.tanggal_masuk,
          // tanggal_keluar: this.edit.tanggal_keluar,
          no_telp: this.edit.no_telp,
          jabatan: this.edit.jabatan
        }).then(() => {
                console.log("Edit Reservation success");
                router.push('/dashboardadmin')
        })
        // .catch(error => {
        //     assign state validation with error
        //     console.log("validasii")
        //     validation.value = error.response.data
        //     console.log(validation.value)
        //     errors.nameErrors = ''
        //     errors.emailErrors = ''
        //     errors.passwordErrors = ''
        //     if (typeof (validation.value.errors.name) !== 'undefined') {
        //         console.log("salah nama")
        //         errors.nameErrors = validation.value.errors.name[0];
        //     }
        //     if (typeof (validation.value.errors.email) !== 'undefined') {
        //         console.log("salah email")
        //         errors.emailErrors = validation.value.errors.email[0]
        //      }
        //     if (typeof (validation.value.errors.password) !== 'undefined') {
        //         console.log("salah password")
        //         errors.passwordErrors = validation.value.errors.password[0]
        //     }

        // })
        this.confirmEdit = false;
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
  