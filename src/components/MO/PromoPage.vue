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
            <v-list-item-title class="headline">Data Promo</v-list-item-title>
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
          <v-btn color="brown" dark @click="dialog = true"> Tambah Promo </v-btn>
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
                v-model="formTodo.no_telp"
                label="Nomor Telepon"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.jabatan"
                label="Jabatan"
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
                v-model="formTodo.no_telp"
                label="no_telp"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.jabatan"
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
  import { router } from '../../router'
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
          nama_pegawai: null,
          umur: null,
          no_telp:null,
          jabatan: null,
          // tanggal_keluar: null,
          // no_telp: null,
          // jabatan: null,
          // delete: null,
          // edit: null,
        },
      };
    },
    mounted() {
      this.getTrainee();
    },
    methods: {
      getTrainee() {
        axios
          .get("http://192.168.1.5/Server_Go_Fit/public/pegawai")
          .then((response) => {
            // this.todos = response.data.data;
            this.todos = response.data.data.filter(item => item.jabatan !== "Admin");
            console.log('response', this.todos);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      },
      save() {
        this.todos.push(this.formTodo);
        let nama_pegawai = this.formTodo.nama_pegawai
        let umur = this.formTodo.umur
        // let tanggal_masuk = "2022-12-22"
        // let tanggal_keluar = "2022-12-26"
        let no_telp = this.formTodo.no_telp
        let jabatan = this.formTodo.jabatan
        // formData.append("jabatan", this.formTodo.jabatan);
        axios.post('http://192.168.1.5/Server_Go_Fit/public/pegawai', {
          nama_pegawai: nama_pegawai,
          umur: umur,
          // tanggal_masuk: tanggal_masuk,
          // tanggal_keluar: tanggal_keluar,
          no_telp:no_telp,
          jabatan:jabatan
        }).then(() => {
                console.log("Added Reservation success");
                router.push('/dashboardadmin')
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
        this.formTodo.nama_pegawai = item.nama_pegawai;
        this.formTodo.umur = item.umur;
        // this.formTodo.tanggal_masuk = item.tanggal_masuk;
        // this.formTodo.tanggal_keluar = item.tanggal_keluar;
        this.formTodo.no_telp = item.no_telp;
        this.formTodo.jabatan = item.jabatan;
        this.confirmEdit = true;
      },

      update() {
        this.edit.nama_pegawai = this.formTodo.nama_pegawai;
        this.edit.umur = this.formTodo.umur;
        // this.edit.tanggal_masuk = this.formTodo.tanggal_masuk;
        // this.edit.tanggal_keluar = this.formTodo.tanggal_keluar;
        this.edit.no_telp = this.formTodo.no_telp;
        this.edit.jabatan = this.formTodo.jabatan;
        axios.put('http://192.168.1.5/Server_Go_Fit/public/pegawai', {
                nama_pegawai: this.edit.nama_pegawai,
                umur: this.edit.umur,
                tanggal_masuk: this.edit.tanggal_masuk,
                tanggal_keluar: this.edit.tanggal_keluar,
                no_telp: this.edit.no_telp,
                jabatan: this.edit.jabatan
        }).then(() => {
                console.log("Added Reservation success");
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
  