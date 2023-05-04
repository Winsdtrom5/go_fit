<template>
  <v-main class="list">
    <v-card>
      <v-list-item>
        <v-list-item-avatar>
          <img
            src="https://th.bing.com/th/id/OIP.f739OETOiqRf2xQJmhT2yQHaD2?pid=ImgDet&rs=1.png"
            alt="John"
        /></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">Menu Makanan</v-list-item-title>
          <v-list-item-subtitle>Layanan Pemesanan</v-list-item-subtitle>
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
        <v-btn color="brown" dark @click="dialog = true"> Buat Pesanan </v-btn>
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
        <!-- <template v-slot:[`item.penutup`]="{ item }">
            <span v-if="item.penutup == 'Penting'">
              <iconify-icon
                icon="mdi-alert-octagon"
                style="color: red"
                width="20"
                height="20"
              ></iconify-icon>
            </span>
            <span v-else-if="item.penutup == 'Biasa'">
              <iconify-icon
                icon="mdi-alert-octagon"
                style="color: green"
                width="20"
                height="20"
              ></iconify-icon>
            </span>
            <span v-else>
              <iconify-icon
                icon="mdi-alert-octagon"
                style="color: blue"
                width="20"
                height="20"
              ></iconify-icon>
            </span>
          </template> -->
      </v-data-table>
    </v-card>

    <v-dialog v-model="confirmEdit" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> Menu Makanan </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="formTodo.pembuka"
              label="Makanan Pembuka"
              required
            ></v-text-field>
            <v-text-field
              v-model="formTodo.desert"
              label="Desert"
              required
            ></v-text-field>
            <v-text-field
              v-model="formTodo.minuman"
              label="Minuman"
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
          <span class="headline"> Menu Makanan </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="formTodo.pembuka"
              label="Makanan Pembuka"
              required
            ></v-text-field>
            <v-text-field
              v-model="formTodo.desert"
              label="Desert"
              required
            ></v-text-field>
            <v-text-field
              v-model="formTodo.minuman"
              label="Minuman"
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
export default {
  name: "LayananMenuUser",
  data() {
    return {
      search: null,
      dialog: false,
      confirmEdit: false,
      confirmDelete: false,
      headers: [
        { text: "Makanan Pembuka", value: "pembuka" },
        { text: "Desert", value: "desert" },
        { text: "Minuman", value: "minuman" },
        { text: "Total Harga", value: "harga" },
        { text: "Actions", value: "actions" },
      ],
      todos: [
        // {
        //   pembuka: "Fried Rice",
        //   penutup: "Penting",
        //   desert: "Tidak pakai cabe",
        //   minuman: "Selesai",
        // },
        // {
        //   pembuka: "Fried Rice",
        //   penutup: "Penting",
        //   desert: "Tidak pakai cabe",
        //   minuman: "Selesai",
        // },
        // {
        //   pembuka: "Fried Rice",
        //   penutup: "Penting",
        //   desert: "Tidak pakai cabe",
        //   minuman: "Selesai",
        // },
      ],
      formTodo: {
        pembuka: null,
        desert: null,
        minuman: null,
        harga: null,
        delete: null,
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
      this.formTodo.pembuka = item.pembuka;
      this.formTodo.desert = item.desert;
      this.formTodo.minuman = item.minuman;
      this.formTodo.harga = item.harga;
      this.confirmEdit = true;
    },
    update() {
      this.edit.pembuka = this.formTodo.pembuka;
      this.edit.desert = this.formTodo.desert;
      this.edit.minuman = this.formTodo.minuman;
      this.edit.harga = this.formTodo.harga;
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
        pembuka: null,
        desert: null,
        minuman: null,
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
