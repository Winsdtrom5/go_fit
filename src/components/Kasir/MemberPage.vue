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
            <v-list-item-title class="headline">Data Member</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search by Nama Member"
            outlined
            hide-details
            style="margin-top: 30px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="brown" dark @click="dialog = true"> Tambah member </v-btn>
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
            <v-icon size="30" color="brown" @click="resetItem(item)">mdi-lock-reset</v-icon>
            <v-icon size="30" color="brown" @click="print(item)">mdi-cloud-print</v-icon>
            <v-toast ref="toast"></v-toast>
          </template>
        </v-data-table>
      </v-card>
      <v-dialog v-model="confirmDialog" max-width="500">
        <v-card>
          <v-card-title class="headline">
              Are you sure you want to delete this Data of {{ itemToDelete ? ' ' + itemToDelete.nama_member + ' From Member' : '' }}?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="confirmDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="deleteConfirmed">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmEdit" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline"> Data Member </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_member"
                label="Nama member"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.umur"
                label="Umur member"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.password"
                label="Password"
                required
                type="password"
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="Nomor Telepon"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.tanggal_lahir"
                label="Tanggal Lahir"
                required
                @click="showDatePicker = true"
              ></v-text-field>
              <v-date-picker
                v-model="formTodo.tanggal_lahir"
                v-if="showDatePicker"
                @input="showDatePicker = false"
              ></v-date-picker>
              <v-text-field
                v-model="formTodo.deposit_uang"
                label="Deposit Uang"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.deposit_kelas"
                label="Deposit Kelas"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.Expiration_Date"
                label="Expiration Date"
                required
                @click="showDatePicker = true"
              ></v-text-field>
              <v-date-picker
                v-model="formTodo.Expiration_Date"
                v-if="showDatePicker"
                @input="showDatePicker = false"
              ></v-date-picker>
              <v-select
                v-model="formTodo.status"
                :items="statusOptions"
                label="Status Membership"
                required
              ></v-select>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >    
          <v-btn color="blue darken-1" text @click="saveupdate">Save</v-btn>
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
            <span class="headline"> Data member </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="formTodo.nama_member"
                label="Nama member"
                required
              ></v-text-field>
              <!-- <v-text-field
                v-model="formTodo.umur"
                label="Umur member"
                required
              ></v-text-field> -->
              <v-text-field
                v-model="formTodo.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.no_telp"
                label="Nomor Telepon"
                required
              ></v-text-field>
              <v-text-field
                v-model="formTodo.tanggal_lahir"
                label="Tanggal Lahir"
                required
                @click="showDatePicker = true"
              ></v-text-field>
              <v-date-picker
                v-model="formTodo.tanggal_lahir"
                v-if="showDatePicker"
                @input="showDatePicker = false"
              ></v-date-picker>
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
  // import { router } from '../../router'
  import axios from 'axios'
  import { createToastInterface } from "vue-toastification";
  // import jsPDF from 'jspdf';
  export default {
    name: "memberPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        confirmDelete: false,
        headers: [
          { text: "Nama Member", value: "nama_member",sortable: true},
          { text: "Umur", value: "umur" },
          { text: "Email", value: "email" },
          { text: "Nomor Telepon", value: "no_telp" },
          { text: "Tanggal Lahir", value: "tanggal_lahir"},
          { text: "Deposit Uang", value: "deposit_uang"},
          { text: "Deposit Kelas", value: "deposit_kelas"},
          { text: "Expiration Date", value: "Expiration_Date"},
          { text: "Status", value: "status"},
          { text: "Actions", value: "actions" },
        ],
        todos: [],
        itemToDelete: null,
        confirmDialog: false,
        data: [], // Initialize data as an empty array
        formTodo: {
          id_member:null,
          nama_member: null,
          password:null,
          umur: null,
          email: null,
          no_telp:null,
          date_daftar:null,
          tanggal_lahir: null,
          deposit_uang: null,
          deposit_kelas: null,
          Expiration_Date: null,
          status: null,
        },
        showDatePicker: false,
        statusOptions: [
          { text: 'active', value: 'active' },
          { text: 'deactive', value: 'deactive' },
          // Add more options here as needed
        ]
      };
    },
    mounted() {
      this.getTrainee();
      // this.filteredTodos.forEach(item => this.checkExpirationDate(item));
    },
    watch: {
      filteredTodos: function() {
        this.checkExpirationDate();
      }
    },
    computed: {
      filteredTodos() {
        if (this.search) {
          return this.todos.filter((todo) =>
            todo.nama_member.toLowerCase().includes(this.search.toLowerCase())
          );
        }
        return this.todos;
      },
    },
    methods: {
      print(item) {
        let dateDaftar = new Date(item.date_daftar);
        console.log(item.date_daftar)
        let year = dateDaftar.getFullYear().toString().slice(-2);
        let month = (dateDaftar.getMonth() + 1).toString().padStart(2, '0');
        let nomorMember = year + '.' + month + '.' + item.id_member;
        if (item.status === 'active') {
          // Generate the member card
          const printContents = `
          <div style="width: 400px; height: 250px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
            <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 15px; color: #4CAF50;">
              Go-Fit
            </div>
            <div style="text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px;">Member Card</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: bold; color: #4CAF50;">Nomor Member:</div>
              <div>${nomorMember}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: bold; color: #4CAF50;">Name:</div>
              <div>${item.nama_member}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: bold; color: #4CAF50;">Age:</div>
              <div>${item.umur}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <div style="font-weight: bold; color: #4CAF50;">Phone:</div>
              <div>${item.no_telp}</div>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <div style="font-weight: bold; color: #4CAF50;">Expiration:</div>
              <div style="font-size: 16px;">${item.Expiration_Date}</div>
            </div>
          </div>
          `;
          // Create a new window to print the member card
          let toast = createToastInterface();
          toast.success("Generating MemberCard", {
            timeout: 2000
          });
          setTimeout(() => {
            // const printWindow = window.open('', 'Print Window', 'height=400,width=600');
            // // Write the print contents to the new window
            // printWindow.document.write(printContents);
            // const printWidth = 400; // Width of print window
            // const printHeight = 250.2; // Height of print window
            // const pdf = new jsPDF({
            //   orientation: printWidth > printHeight ? "landscape" : "portrait",
            //   unit: "px",
            //   format: [printWidth, printHeight]
            // });
            // // Add the print contents to the PDF document
            // pdf.html(printContents, {
            //   callback: function () {
            //     // Print the PDF document
            //     pdf.autoPrint();
            //     // Save the PDF document to a file
            //     pdf.save('member_card_'+item.nama_member+'.pdf');
            //   }
            // });
            // // Wait for the window to load and then call the print method
            // printWindow.onload = function() {
            //     printWindow.print();
            // };
            const popup = window.open("", "_blank");
            popup.document.write(printContents);
            popup.document.close();
            popup.focus();
            popup.print();
            popup.close();
          }, 2000);
        } else {
          // Member is not active, so display an error message
          // alert('Cannot print member card. Memeber status is deactive.');
          let toast = createToastInterface();
          toast.error("Cannot print member card. Member status is deactive", {
            timeout: 2000
          });
        }
      },
      getTrainee() {
        axios
          .get("http://192.168.1.5/Server_Go_Fit/public/member")
          .then((response) => {
            // this.todos = response.data.data;
            this.todos = response.data.data
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
      saveupdate() {
        let today = new Date();
        let nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        if (!this.formTodo.password) {
            console.log("Password cannot be empty");
            return;
        }
        axios.put(`http://192.168.1.5/Server_Go_Fit/public/member/${this.formTodo.id_member}`, {
            id_member:this.formTodo.id_member,
            nama_member: this.formTodo.nama_member,
            password: this.formTodo.password,
            umur: this.formTodo.umur,
            email: this.formTodo.email,
            no_telp: this.formTodo.no_telp,
            tanggal_lahir: this.formTodo.tanggal_lahir,
            deposit_uang: this.formTodo.deposit_uang,
            deposit_kelas: this.formTodo.deposit_kelas,
            Expiration_Date: this.formTodo.Expiration_Date,
            status: 'active'
        })
        .then(response => {
            console.log("Edit Member success");
            console.log('response password', this.formTodo.password);
            console.log("Link", `http://192.168.1.5/Server_Go_Fit/public/member/${this.formTodo.id_member}`);
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
      deleteConfirmed() {
        axios.delete('http://192.168.1.5/Server_Go_Fit/public/member/' + this.itemToDelete.id_member)
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

      save() {
      // Create a FormData object to hold the form data
        let today = new Date();
        let nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        let date = new Date(nextYear.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0,10); // format as yyyy-mm-dd
        let birthDate = new Date(this.formTodo.tanggal_lahir);
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        let formTodo = new FormData();
        formTodo.append('nama_member', this.formTodo.nama_member);
        formTodo.append('password', this.formTodo.tanggal_lahir);
        formTodo.append('umur', age);
        formTodo.append('email', this.formTodo.email);
        formTodo.append('no_telp', this.formTodo.no_telp);
        formTodo.append('date_daftar', today.toISOString().slice(0,10));
        formTodo.append('tanggal_lahir', this.formTodo.tanggal_lahir);
        formTodo.append('deposit_uang', 0);
        formTodo.append('deposit_kelas', 0);
        formTodo.append('Expiration_Date', date);
        formTodo.append('status', 'active');
        // Send a POST request to the backend API
        axios.post('http://192.168.1.5/Server_Go_Fit/public/member', formTodo)
          .then(response => {
            // Handle successful response
            let toast = createToastInterface();
            toast.success("Data Berhasil Ditambahkan", {
              timeout: 2000
            });
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
        this.formTodo.id_member = item.id_member;
        this.formTodo.nama_member = item.nama_member;
        this.formTodo.umur = item.umur;
        this.formTodo.email = item.email;
        this.formTodo.password = item.password;
        this.formTodo.tanggal_lahir = item.tanggal_lahir;
        this.formTodo.no_telp = item.no_telp;
        this.formTodo.deposit_uang = item.deposit_uang;
        this.formTodo.deposit_kelas = item.deposit_kelas;
        this.formTodo.Expiration_Date = item.Expiration_Date;
        this.formTodo.status = item.status;
        this.formTodo.status = this.statusOptions.find(option => option.text === item.status)?.value || null;
        this.confirmEdit = true;
      },
      checkExpirationDate() {
        const today = new Date();
        this.filteredTodos.forEach(item => {
          const expDate = new Date(item.Expiration_Date);
          if (expDate < today) {
            item.status = "deactive";
          } else {
            item.status = "active";
          }
          axios.put(`http://192.168.1.5/Server_Go_Fit/public/member/${item.id_member}`, {
            id_member: item.id_member,
            nama_member: item.nama_member,
            password: item.password,
            umur: item.umur,
            email: item.email,
            no_telp: item.no_telp,
            tanggal_lahir: item.tanggal_lahir,
            deposit_uang: item.deposit_uang,
            deposit_kelas: item.deposit_kelas,
            Expiration_Date: item.Expiration_Date,
            status: item.status,
          })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log(error);
          });
        });
      },
      cancelUpdate() {
        this.resetForm();
        this.confirmEdit = false;
      },
      // hapus() {
        
      // },
      cancelDelete() {
        this.confirmDelete = false;
      },
      resetItem(item){
        axios
          .put(`http://192.168.1.5/Server_Go_Fit/public/member/${item.id_member}`, {
              nama_member: item.nama_member,
              password: item.tanggal_lahir,
              umur: item.umur,
              email: item.email,
              no_telp: item.no_telp,
              tanggal_lahir: item.tanggal_lahir,
              deposit_uang: item.deposit_uang,
              deposit_kelas: item.deposit_kelas,
              Expiration_Date: item.Expiration_Date,
              status: item.status,
            })
            let toast = createToastInterface();
            toast.success("Reset Password successful. Restarting Page", {
              timeout: 2000
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
      },
      deleteItem(item) {
        // axios.delete(`http://192.168.1.5/Server_Go_Fit/public/member/${item.id_member}`)
        // window.location.reload();
          this.itemToDelete = item;
          this.confirmDialog = true;
      },
      resetForm() {
        this.formTodo = {
          id_member:null,
          nama_member: null,
          password:null,
          umur: null,
          email: null,
          no_telp:null,
          date_daftar:null,
          tanggal_lahir: null,
          deposit_uang: null,
          deposit_kelas: null,
          Expiration_Date: null,
          status: null,
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
  .member-card {
    border: 1px solid black;
    width: 400px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  .member-card h2 {
    margin: 0;
    font-size: 24px;
  }

  .member-card div {
    font-size: 18px;
    margin: 5px 0;
  }
</style>