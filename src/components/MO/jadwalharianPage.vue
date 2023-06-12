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
            <v-list-item-title class="headline">Morning Activity</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search by Nama Kelas"
            @input="searchTrainee"
            outlined
            hide
            details
            style="margin-top: 30px"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="brown" dark @click="checkLastDay"> Generate Jadwal </v-btn>
        </v-card-title>
      </v-card>
  
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredMorning"
          :search="search"
          item-key="id"
          show-expand
        >
        <template v-slot:[`item.jam`]="{ item }">
          {{ formatTime(item.jam) }}
        </template>
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
            <span class="headline"> Data Pegawai </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-autocomplete
                v-model="formTodo.status"
                :items="statusOptions"
                label="Status Kelas"
                required
              ></v-autocomplete>
              <v-autocomplete
                v-if="showInstrukturOptions"
                v-model="formTodo.nama"
                :items="instrukturOptions"
                label="Nama Instruktur"
                required
              ></v-autocomplete> 
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >    
          <v-btn color="blue darken-1" text @click="checkDuplicateUpdate">Save</v-btn>
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
  
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Afternoon Activity</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
  
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredAfternoon"
          :search="search"
          item-key="desert"
          show-expand
        >
          <template v-slot:[`item.jam`]="{ item }">
            {{ formatTime(item.jam) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon size="30" color="brown" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
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
              <v-autocomplete
                v-model="formTodo.status"
                :items="statusOptions"
                label="Status Kelas"
                required
              ></v-autocomplete>
              <v-autocomplete
                v-if="showInstrukturOptions"
                v-model="formTodo.nama"
                :items="instrukturOptions"
                label="Nama Instruktur"
                required
              ></v-autocomplete> 
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >    
          <v-btn color="blue darken-1" text @click="checkDuplicateUpdate">Save</v-btn>
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
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Evening Activity</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-title>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
  
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredEvening"
          :search="search"
          item-key="desert"
          show-expand
        >
          <template v-slot:[`item.jam`]="{ item }">
            {{ formatTime(item.jam) }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon size="30" color="brown" @click="editItem(item)"
              >mdi-pencil</v-icon
            >
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
              <v-autocomplete
                v-model="formTodo.status"
                :items="statusOptions"
                label="Status Kelas"
                required
              ></v-autocomplete>
              <v-autocomplete
                v-if="showInstrukturOptions"
                v-model="formTodo.nama"
                :items="instrukturOptions"
                label="Nama Instruktur"
                required
              ></v-autocomplete> 
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelUpdate">
              Cancel</v-btn
            >    
          <v-btn color="blue darken-1" text @click="checkDuplicateUpdate">Save</v-btn>
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
    </v-main>
  </template>
  
  
  <script>
  import axios from 'axios'
  import { createToastInterface } from "vue-toastification";
  export default {
    name: "jadwalharianPage",
    data() {
      return {
        search: null,
        dialog: false,
        confirmEdit: false,
        confirmDelete: false,
        headers: [
          { text: "Hari", value: "hari" },
          { text: "Tanggal", value: "tanggal_kelas" },
          { text: "Jam Mulai", value: "jam" },
          { text: "Jam Selesai", value: "jamSelesai" },
          { text: "Nama Kelas", value: "nama_kelas" },
          { text: "Nama Instruktur", value: "nama" },
          { text: "Status", value: "status" },
          { text: "Instruktur Pengganti", value: "instruktur_pengganti" },
          { text: "Actions", value: "actions" },
        ],
        morning: [],
        afternoon:[],
        evening:[],
        data: [],
        trainee: [],
        filteredMorning: [],
        filteredAfternoon: [],
        filteredEvening: [],
        formTodo: {
          id:null,
          status: null,
          jam:null,
          hari:null,
          nama_kelas: null,
          nama:null,
        },
        showDatePicker: false,
        formKelas:{
          id_kelas:null,
          nama_kelas:null,
          tarif:null,
        },
        kelasOptions: [],
        formInstruktur:{
          id_instruktur:null,
          password:null,
          nama:null,
          umur:null,
          no_telp:null,
        },
        hariOptions:[
          'Senin',
          'Selasa',
          'Rabu',
          'Kamis',
          'Jumat',
          'Sabtu',
          'Minggu',
        ],
        statusOptions:[
          'scheaduled',
          'Libur',
          'Digantikan',
        ],
        instrukturOptions: [],
      };
    },
    computed: {
      showInstrukturOptions() {
        return this.formTodo.status == 'Digantikan';
      },
      filteredTodos() {
        if (this.search) {
          return this.todos.filter((todo) =>
            todo.nama_member.toLowerCase().includes(this.search.toLowerCase())
          );
        }
        return this.todos;
      },
      morningWithJamSelesai() {
        return this.morning.map((item) => {
          const jamMulai = new Date(`1970-01-01T${item.jam}`);
          const jamSelesai = new Date(jamMulai.getTime() + 2 * 60 * 60 * 1000);
          return {
            ...item,
            jamSelesai: jamSelesai.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }),
          };
        });
      },
      afternoonWithJamSelesai() {
        return this.afternoon.map((item) => {
          const jamMulai = new Date(`1970-01-01T${item.jam}`);
          const jamSelesai = new Date(jamMulai.getTime() + 2 * 60 * 60 * 1000);
          return {
            ...item,
            jamSelesai: jamSelesai.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }),
          };
        });
      },
      eveningWithJamSelesai() {
        return this.evening.map((item) => {
          const jamMulai = new Date(`1970-01-01T${item.jam}`);
          const jamSelesai = new Date(jamMulai.getTime() + 2 * 60 * 60 * 1000);
          return {
            ...item,
            jamSelesai: jamSelesai.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }),
          };
        });
      },
    },
    
    mounted() {
      this.getTrainee();
      this.loadKelasOptions();
      this.loadInstrukturOptions();  // call the method to apply search filter on initial data
    },
    methods: {
      getTrainee() {
        axios
          .get("https://gofit123.xyz/Server_Go_Fit/public/jadwalharian")
          .then((response) => {
            // filter and sort the data into morning, afternoon, and evening arrays
            this.morning = response.data.data.filter(item => {
              const time = Number(item.jam.split(":")[0]);
              return time >= 5 && time < 12;
            });
            
            this.afternoon = response.data.data.filter(item => {
              const time = Number(item.jam.split(":")[0]);
              return time >= 12 && time < 17;
            });
            
            this.evening = response.data.data.filter(item => {
              const time = Number(item.jam.split(":")[0]);
              return time >= 17 || time < 5;
            });

            // populate filteredMorning and filteredAfternoon with data
            this.searchTrainee();

            let toast = createToastInterface();
            toast.success("Show Data Success !", {
              timeout: 2000
            });
            console.log(response.data.data);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
      },
      checkLastDay() {
        const url = `https://gofit123.xyz/Server_Go_Fit/public/jadwalharian`;
        axios.get(url)
          .then(response => {
            // Handle successful response
            console.log(response.data);
            if (response.data.data.length > 0) {
              // Show a warning message using the toast library
              let toast = createToastInterface();
              toast.error("Sudah Generate Minggu Ini", {
                timeout: 2000
              });
            } else {
              // Create the record
              this.save();
            }
          })  
          .catch(error => {
            // Handle error response
            this.save();
            console.error(error);
            // Do something with the error, e.g. show error message
          });
      },
      searchTrainee() {
        if (!this.search) {
          this.filteredMorning = this.morningWithJamSelesai;
          this.filteredAfternoon = this.afternoonWithJamSelesai;
          this.filteredEvening = this.eveningWithJamSelesai;
        } else {
          const searchTerm = this.search.toLowerCase();
          this.filteredMorning = this.morningWithJamSelesai.filter((item) => {
            return (
              item.nama_kelas.toLowerCase().includes(searchTerm)
            );
          });
          this.filteredAfternoon = this.afternoonWithJamSelesai.filter((item) => {
            return (
              item.nama_kelas.toLowerCase().includes(searchTerm)
            );
          });
          this.filteredEvening = this.eveningWithJamSelesai.filter((item) => {
            return (
              item.nama_kelas.toLowerCase().includes(searchTerm)
            );
          });
        }
      },
      // other methods...

      loadKelasOptions() {
        // fetch data from kelas database
        axios.get('https://gofit123.xyz/Server_Go_Fit/public/kelas')
          .then(response => {
            // map response data to an array of options
            this.kelasOptions = response.data.data.map((kelas) => kelas.nama_kelas);
          })
          .catch(error => {
            console.error(error);
          });
      },
      loadInstrukturOptions() {
        // fetch data from kelas database
        axios.get('https://gofit123.xyz/Server_Go_Fit/public/instruktur')
          .then(response => {
            // map response data to an array of options
            this.instrukturOptions = response.data.data.map((instruktur) => instruktur.nama);
          })
          .catch(error => {
            console.error(error);
          });
      },
      formatTime(time) {
        const [hours, minutes] = time.split(":");
        const amPm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${amPm}`;
      },
      save() {
        // Send a POST request to the backend API
        axios.post('https://gofit123.xyz/Server_Go_Fit/public/jadwalharian')
          .then(response => {
            console.log(response.data);
            this.resetForm();
            this.dialog = false;
            this.getTrainee();
            // window.location.reload();
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
        this.showDatePicker= false;
      },
      editItem(item) {
        this.edit = item;
        this.formTodo.id = item.id;
        this.formTodo.nama = item.nama;
        this.formTodo.status = item.status;
        this.formTodo.jam = item.jam;
        this.formTodo.hari = item.hari;
        this.confirmEdit = true;
        console.log(this.formTodo.status)
      },
      checkDuplicateUpdate() {
        const jamDate = new Date();
        jamDate.setHours(this.formTodo.jam.split(':')[0]);
        jamDate.setMinutes(this.formTodo.jam.split(':')[1]);
        const jam = jamDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const formattedJam = jam.replace('.', ':');
        console.log(this.formTodo.nama)
        if(this.formTodo.status != 'Digantikan'){
          this.saveupdate();
        }else{
          const url = `https://gofit123.xyz/Server_Go_Fit/public/jadwalharian/${this.formTodo.nama}/${this.formTodo.hari}/${formattedJam}`;
          axios.get(url)
            .then(response => {
              if (response.data.data) {
                let toast = createToastInterface();
                toast.error("Jadwal Instruktur Bertabrakan", {
                  timeout: 2000
                });
                return;
              } else {
                // Check if data is not changed
                if (this.formTodo.jam === this.originalData.jam) {
                  this.saveupdate();
                } else {
                  // Show warning message
                  let toast = createToastInterface();
                  toast.warning("Data has been changed", {
                    timeout: 2000
                  });
                  return;
                }
              }
            })
            .catch(error => {
              this.saveupdate();
              console.error(error);
            });
        }
        
      },
      saveupdate() {
          console.log(this.formTodo.id)
          axios.put(`https://gofit123.xyz/Server_Go_Fit/public/jadwalharian/${this.formTodo.id}`, {
              status: this.formTodo.status,
              nama: this.formTodo.nama,
          })
          .then(response => {
              console.log(response.data.data);
              // Refresh the page
          })
          .catch(error => {
              if (error.response) {
                  console.log("Error response status:", error.response.status);
                  console.log("Error response data:", error.response.data);
              }
          });
          // window.location.reload(); 
          this.getTrainee();
          this.confirmEdit = false;
          // this.getTrainee();
        },
      
  
      cancelUpdate() {
        this.resetForm();
        this.confirmEdit = false;
      },
      hapus() {
        axios.delete(`https://gofit123.xyz/Server_Go_Fit/public/jadwalharian/${this.formTodo.id}`)
        // window.location.reload();
        this.getTrainee();
      },
      cancelDelete() {
        this.confirmDelete = false;
      },
      deleteItem(item) {
        axios.delete(`https://gofit123.xyz/Server_Go_Fit/public/jadwalharian/${item.id}`)
        // window.location.reload();
        this.getTrainee();
      },
      resetForm() {
        this.formTodo = {
          id:null,
          hari: null,
          jam: null,
          nama:null,
          nama_kelas: null,
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
  