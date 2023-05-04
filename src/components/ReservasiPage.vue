<template>
    <v-main class="list">
      <v-card>
        <v-list-item>
          <v-list-item-avatar>
            <img
              src="https://th.bing.com/th/id/OIP.rim4ZpZDit9PoQwMBVaeNQHaHa?pid=ImgDet&w=512&h=512&rs=1.jpeg"
              alt="John"
          /></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">Reservasi</v-list-item-title>
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
          <v-btn color="brown" dark @click="dialog = true"> Buat Reservasi </v-btn>
        </v-card-title>
      </v-card>
  
      <v-card>
        <v-data-table
          :headers="headers"
          :items="todos"
          :search="search"
          :expanded.sync="expanded"
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
            <span class="headline"> Data Reservasi </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_pemesan"
                label="Nama Pemesan"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.tipe_kamar"
                label="Tipe Kamar"
                required
              ></v-text-field>
              <!-- <v-menu v-model="form.tanggal_masuk" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">                            
                <template v-slot:activator="{ on, attrs }">                                                                
                  <v-text-field outlined color="black" class="textfield mt-3" v-model="form.tanggal_masuk" label="Tanggal Check-in"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>                         
                <v-date-picker v-model="tanggal_masuk"></v-date-picker>                  
              </v-menu>
              <v-menu v-model="form.tanggal_keluar" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">                            
                <template v-slot:activator="{ on, attrs }">                                                                
                  <v-text-field outlined color="black" class="textfield mt-3" v-model="form.tanggal_keluar" label="Tanggal Check-out"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>                         
                <v-date-picker v-model="form.tanggal_keluar"></v-date-picker>                  
              </v-menu> -->
              <v-text-field
                v-model="formTodo.status"
                label="Status"
                required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="update"> Save</v-btn>
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
            <span class="headline"> Data Reservasi </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_pemesan"
                label="Nama Pemesan"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.tipe_kamar"
                label="Tipe Kamar"
                required
              ></v-text-field>
              <!-- <v-menu v-model="form.tanggal_masuk" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">                            
                <template v-slot:activator="{ on, attrs }">                                                                
                  <v-text-field outlined color="black" class="textfield mt-3" v-model="form.tanggal_masuk" label="Tanggal Check-in"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>                         
                <v-date-picker v-model="tanggal_masuk"></v-date-picker>                  
              </v-menu>
              <v-menu v-model="form.tanggal_keluar" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">                            
                <template v-slot:activator="{ on, attrs }">                                                                
                  <v-text-field outlined color="black" class="textfield mt-3" v-model="form.tanggal_keluar" label="Tanggal Check-out"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>                         
                <v-date-picker v-model="form.tanggal_keluar"></v-date-picker>                  
              </v-menu> -->
              <v-text-field
                v-model="formTodo.status"
                label="Status"
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
  import { router } from '../router'
  import axios from 'axios'
  export default {
    name: "ReservasiPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        confirmDelete: false,
        headers: [
          { text: "Nama Pemesan", value: "nama_pemesan" },
          { text: "Tipe Kamar", value: "tipe_kamar" },
          { text: "Tanggal Check-in", value: "tanggal_masuk" },
          { text: "Tanggal Check-out", value: "tanggal_keluar" },
          { text: "Status", value: "status" },
          { text: "Total Harga", value: "harga" },
          { text: "Actions", value: "actions" },
        ],
        todos: [
          
        ],
        formTodo: {
          nama_pemesan: null,
          tipe_kamar: null,
          tanggal_masuk: null,
          tanggal_keluar: null,
          status: null,
          harga: null,
          delete: null,
          edit: null,
        },
      };
    },
    mounted() {
      this.getTrainee();
    },
    methods: {
      getTrainee() {
        axios
        .get("https://tubes-hotel-pw.herokuapp.com/api/reservasi")
        .then((response) => {
          this.formTodo = response.data.data;
          console.log('response', this.allData);
          //assign state posts with response data
          this.todos.push(this.formTodo);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
      },
      save() {
        this.todos.push(this.formTodo);
        let nama_pemesan = this.formTodo.nama_pemesan
        let kamar = this.formTodo.tipe_kamar
        let tanggal_masuk = "2022-12-22"
        let tanggal_keluar = "2022-12-26"
        let status = this.formTodo.status
        // formData.append("harga", this.formTodo.harga);
        axios.post('https://tubes-hotel-pw.herokuapp.com/api/reservasi', {
          nama_pemesan: nama_pemesan,
          tipe_kamar: kamar,
          tanggal_masuk: tanggal_masuk,
          tanggal_keluar: tanggal_keluar,
          status:status
        }).then(() => {
                console.log("Added Reservation success");
                router.push('/dashboard')
        })
        this.resetForm();
        this.dialog = false;
      },
      cancel() {
        this.resetForm();
        this.dialog = false;
      },
      editItem(item) {
        this.edit = item;
        this.formTodo.nama_pemesan = item.nama_pemesan;
        this.formTodo.tipe_kamar = item.tipe_kamar;
        this.formTodo.tanggal_masuk = item.tanggal_masuk;
        this.formTodo.tanggal_keluar = item.tanggal_keluar;
        this.formTodo.status = item.status;
        this.formTodo.harga = item.harga;
        this.confirmEdit = true;
      },

      update() {
        this.edit.nama_pemesan = this.formTodo.nama_pemesan;
        this.edit.tipe_kamar = this.formTodo.tipe_kamar;
        this.edit.tanggal_masuk = this.formTodo.tanggal_masuk;
        this.edit.tanggal_keluar = this.formTodo.tanggal_keluar;
        this.edit.status = this.formTodo.status;
        this.edit.harga = this.formTodo.harga;
        axios.put('https://tubes-hotel-pw.herokuapp.com/api/reservasi', {
                name: this.edit.nama_pemesan,
                tipe_kamar: this.edit.tipe_kamar,
                tanggal_masuk: this.edit.tanggal_masuk,
                tanggal_keluar: this.edit.tanggal_keluar,
                status: this.edit.status,
                harga: this.edit.harga
        }).then(() => {
                console.log("Added Reservation success");
                router.push('/dashboard')
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
          nama_pemesan: null,
          tipe_kamar: null,
          tanggal_masuk: null,
          tanggal_keluar: null,
          status: null,
          harga: null,
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
  