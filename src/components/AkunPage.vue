<template>
    <v-main class="list">
      <v-card>
        <v-list-item>
          <v-list-item-avatar>
            <img
              src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-369-456321-512.png"
              alt="John"
          /></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">Akun Saya</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <!-- <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            outlined
            hide
            details
            style="margin-top: 30px"
          ></v-text-field> -->
          <v-spacer></v-spacer>
          <v-btn color="brown" dark @click="confirmEdit = true"> Perbarui Informasi </v-btn>
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
          </template>
        </v-data-table>
      </v-card>
  
      <v-dialog v-model="confirmEdit" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data User </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.username"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.nama"
                label="Nama Lengkap"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.noTelp"
                label="No Handphone"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.lahir"
                label="Tanggal Lahir"
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

        
      <!-- <v-dialog v-model="confirmDelete" persistent max-width="500px">
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
      </v-dialog> -->

      <!-- <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data Reservasi </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.username"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.nama"
                label="Nama Lengkap"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.noTelp"
                label="No Handphone"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.lahir"
                label="Tanggal Lahir"
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
      </v-dialog> -->

    </v-main>
  </template>
  
  <script>
  export default {
    name: "AkunPage",
    data() {
      return {
        search: null,
        confirmEdit: false,
        headers: [
          { text: "Username", value: "username" },
          { text: "Nama Lengkap", value: "nama" },
          { text: "Email", value: "email" },
          { text: "No Handphone", value: "noTelp" },
          { text: "Tanggal Lahir", value: "lahir" },
        ],
        todos: [
          
        ],
        formTodo: {
          username: null,
          nama: null,
          email: null,
          noTelp: null,
          lahir: null,
          edit: null,
        },
      };
    },
    methods: {
      save() {
        this.todos.push(this.formTodo);
        this.resetForm();
        this.dialog = false;
      },
      cancel() {
        this.resetForm();
        this.dialog = false;
      },
      editItem(item) {
        this.edit = item;
        this.formTodo.username = item.username;
        this.formTodo.nama = item.nama;
        this.formTodo.email = item.email;
        this.formTodo.noTelp = item.noTelp;
        this.formTodo.lahir = item.lahir;
        this.confirmEdit = true;
      },
      update() {
        this.edit.username = this.formTodo.username;
        this.edit.nama = this.formTodo.nama;
        this.edit.email = this.formTodo.email;
        this.edit.noTelp = this.formTodo.noTelp;
        this.edit.lahir = this.formTodo.lahir;
        this.confirmEdit = false;
      },
      cancelUpdate() {
        this.resetForm();
        this.confirmEdit = false;
      },
    //   hapus() {
    //     const index = this.todos.indexOf(this.delete);
    //     this.todos.splice(index, 1);
    //     this.confirmDelete = false;
    //   },
    //   cancelDelete() {
    //     this.confirmDelete = false;
    //   },
    //   deleteItem(item) {
    //     this.delete = item;
    //     this.confirmDelete = true;
    //   },
      resetForm() {
        this.formTodo = {
          username: null,
          nama: null,
          email: null,
          noTelp: null,
          lahir: null,
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
  