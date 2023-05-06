<template>
  <div class="container">
    <h1>Gym Transaction</h1>
    <div class="row">
      <div class="col">
        <label for="member-name">Member Name</label>
        <v-autocomplete
          v-model="formTodo.nama_member"
          :items="members"
          item-text="nama_member"
          label="Nama Member"
          required
        ></v-autocomplete>
      </div>
      <div class="col">
        <label for="status">Status</label>
        <input id="status" type="text" v-model="formMember.status" readonly/>
      </div>
      <div class="col">
        <label for="expiry-date">Expired Date</label>
        <input id="expiry-date" type="text" v-model="formMember.Expiration_Date" readonly/>
      </div>
    </div>
    <div class="button-container">
      <div v-if="formMember.status === 'deactive'">
        <div class="row mt-3">
          <div class="col">
            <label for="total-price">Total Harga</label>
            <input id="total-price" type="text" :value="defaultTotal" readonly/>
          </div>
          <div class="col">
            <label for="paid-amount">Input Harga</label>
            <input id="paid-amount" type="number" v-model="inputTotalValue" :min="defaultTotal"/>
          </div>
        </div>
        <button class="activate-button" @click="activateMember">Activate Membership</button>
      </div>
      <div v-if="formMember.status === 'active'">
        <div class="row">
          <div class="row mt-3">
            <div class="col">
              <button class="activate-button" @click="showDepositKelas = true; showDepositUang = false;" style="white-space: nowrap;">Deposit Kelas</button>
            </div>
            <div class="col">
              <button class="activate-button" @click="showDepositKelas = false; showDepositUang = true;" style="white-space: nowrap;">Deposit Uang</button>
            </div>
          </div>
        </div>
        <div class="row mt-3">
            <div class="col">
              <div v-if="showDepositKelas" class="form-row">
                <div class="member-container">
                  <label for="nama-kelas">Nama Kelas</label>
                  <v-autocomplete
                    id="nama-kelas"
                    v-model="formTodo.nama_kelas"
                    :items="kelasOptions"
                    item-text="nama_kelas"
                    required
                  ></v-autocomplete>
                </div>   
                <div class="deposit-container">
                  <label for="deposit-kelas">Deposit Kelas Total</label>
                  <input id="deposit-kelas" class="customfield" type="text" v-model="jumlah_deposit" />
                </div>
                <div class="total-harga-container">
                  <label for="total-price">Total Harga</label>
                  <input
                    class="customfield"
                    v-model="formdepositKelas.total_harga"
                    readonly
                  />
                </div>
                <div class="bayar-container">
                  <label for="deposit-kelas">Bayar</label>
                  <input id="deposit-kelas" class="customfield" type="text" v-model="jumlah_deposit" />
                </div>
              </div>
              <div v-if="showDepositKelas">
                <button class="activate-button" @click="activateMember">Add Into Account</button>
              </div>
              <div v-if="showDepositUang">
                <label for="total-price">Total Harga</label>
                <input id="total-price" class="customfield" type="text" :value="totalHarga" readonly />
              </div>
            </div>
          </div>
        <div class="row mt-3" v-if="showDepositKelas || showDepositUang">
          <div class="col">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import jsPDF from 'jspdf';
import axios from "axios";
import { createToastInterface } from "vue-toastification";
export default {
  props: {
        username: {
            type: String,
            required: true
        }
    },
  data() {
    return {
      formMember: {
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
      members: [],
      formTodo: {
        id:null,
        hari: null,
        jam: null,
        nama:null,
        nama_kelas: null,
      },
      formdepositKelas: {
        id: null,
        nama_member: null,
        tanggal: null,
        jumlah_deposit: null,
        nama_kelas: null,
        nama_pegawai: null,
        batas_berlaku: null,
        total_harga: 0,
      },
      formKelas: {
        id_kelas: null,
        nama_kelas: null,
        tarif: null,
      },
      formAktivasi: {
        nama_member:null,
        nama: null  
      },
      formPegawai: {
        nama_pegawai:null,
        password:null,
        email:null,
        umur:null,
        jabatan:null,
        no_telp:null,
      },
      kelasOptions: [],
      membershipNumber: "",
      expiryDate: "",
      isActivated: false,
      errorMessage: "",
      showDepositKelas: false,
      showDepositUang: false,
      jumlah_deposit: 0,
      inputTotalValue: '',
      inputTotal: 0,
      remainingTotalValue: 0,
      namapegawai:null,
    };
  },
  computed: {
    defaultTotal() {
      return this.formMember.status === 'deactive' ? '3000000' : this.Total;
    },
    remainingTotal() {
      return this.remainingTotalValue.toLocaleString();
    },
    remainingTotalError() {
      return Number(this.remainingTotal) < 0;
    },
    selectedKelas() {
      return this.kelasOptions.find((kelas) => kelas.nama_kelas === this.formTodo.nama_kelas);
    },
    totalHarga: {
      get() {
        if (!this.selectedKelas || !this.jumlah_deposit) {
          return "";
        }
        return this.selectedKelas.tarif * this.jumlah_deposit;
      },
      set(value) {
        this.formdepositKelas.total_harga = value;
      },
    },
    Total() {
      const deposit_kelas = Number(this.formMember.deposit_kelas) || 0;
      const deposit_uang = Number(this.formMember.deposit_uang) || 0;
      return deposit_kelas + deposit_uang;
    },
    isMemberNameDisabled() {
      return !this.formTodo.nama_member;
    },
  },
  mounted() {
    this.loadMemberOptions();
    this.loadKelasOptions();
    this.checkKembalian(this.remainingTotal);
  },
  methods: {
    updateTotalHarga(jumlah_deposit, nama_kelas) {
      if (nama_kelas && jumlah_deposit) {
        const selectedKelas = this.kelasOptions.find((kelas) => kelas.nama_kelas === nama_kelas.toString());
        if (selectedKelas !== undefined && selectedKelas !== null) {
          this.formdepositKelas.total_harga = selectedKelas.tarif * jumlah_deposit;
        } else {
          this.formdepositKelas.total_harga = 0;
        }
      } else {
        this.formdepositKelas.total_harga = 0;
      }
    },
    loadKelasOptions() {
  // fetch data from kelas database
      axios.get('http://192.168.1.2/Server_Go_Fit/public/kelas')
        .then(response => {
          // map response data to an array of options
          this.kelasOptions = response.data.data.map((kelas) => {
            return {
              id_kelas: kelas.id_kelas,
              nama_kelas: kelas.nama_kelas,
              tarif: kelas.tarif,
            };
          });
          // store the array of objects in formKelas
          this.formKelas = this.kelasOptions;
        })
        .catch(error => {
          console.error(error);
        });
    },
    loadMemberOptions() {
      // fetch data from kelas database
      axios.get('http://192.168.1.2/Server_Go_Fit/public/member')
        .then(response => {
          // map response data to an array of options
          this.members = response.data.data.map((member) => {
            return {
              id_member: member.id_member,
              nama_member: member.nama_member,
              password: member.password,
              umur: member.umur,
              email: member.email,
              date_daftar: member.date_daftar,
              no_telp:member.no_telp,
              tanggal_lahir: member.tanggal_lahir,
              deposit_uang: member.deposit_uang,
              deposit_kelas: member.deposit_kelas,
              Expiration_Date: member.Expiration_Date,
              status: member.status,
            };
          });
        })
        .catch(error => {
          console.error(error);
        });
    },
    getMemberData(memberName) {
      axios.get('http://192.168.1.2/Server_Go_Fit/public/member')
        .then(response => {
          // filter the response data to find the member with matching nama_member
          const matchingMember = response.data.data.filter((member) => member.nama_member === memberName)[0];
          
          if (matchingMember) {
            this.formMember = matchingMember;
          } else {
            this.formMember = {
              id_member: null,
              nama_member: null,
              password: null,
              umur: null,
              email: null,
              no_telp: null,
              date_daftar: null,
              tanggal_lahir: null,
              deposit_uang: null,
              deposit_kelas: null,
              Expiration_Date: null,
              status: null,
            };
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    activateMember() {
      if (this.inputTotalValue < this.defaultTotal) {
        console.log(this.inputTotal)
        console.log(this.defaultTotal)
        let toast = createToastInterface();
        toast.error("Uang Anda Kurang", {
          timeout: 2000
        });
        return;
      }else{
    // call API to activate the member's membership
          let today = new Date();
          // let options = { timeZone: 'Asia/Jakarta' };
          // let dateTimeWIB = today.toLocaleString('id-ID', options);
          let nextYear = new Date();
          nextYear.setFullYear(today.getFullYear() + 1);
          let date = new Date(nextYear.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0,10); // format as yyyy-mm-dd
          // axios.put('http://192.168.1.2/Server_Go_Fit/public/member/' + this.formMember.id_member, {
          //   Expiration_Date: date,
          //   status: 'active',
          // })
          // .then(response => {
          //   this.isActivated = true;
          //   this.errorMessage = "";
          //   console.log(response);
          // })
          // .catch(error => {
          //   console.error(error);
          //   this.isActivated = false;
          //   this.errorMessage = "Failed to activate membership. Please try again.";
          //   return
          // });
          let formAktivasi = new FormData();
          formAktivasi.append('nama_member', this.formTodo.nama_member);
          formAktivasi.append('nama', this.username);
          formAktivasi.append('tanggal', today.toISOString().slice(0,10));
          formAktivasi.append('harga', 3000000);
          axios.post('http://192.168.1.2/Server_Go_Fit/public/aktivasi', formAktivasi)
          .then(response => {
            console.log(this.formMember.date_daftar);
            let dateDaftar = new Date(this.formMember.date_daftar);
            let year = dateDaftar.getFullYear().toString().slice(-2);
            let month = (dateDaftar.getMonth() + 1).toString().padStart(2, '0');
            let nomorMember = year + '.' + month + '.' + this.formMember.id_member;
            axios.get('http://192.168.1.2/Server_Go_Fit/public/pegawai/' + this.username, {})
            .then((response) => {
                if (response && response.data && response.data.data) {
                  let data = response.data.data;
                  this.namapegawai = data[0].nama_pegawai;
                  axios.get('http://192.168.1.2/Server_Go_Fit/public/aktivasi')
                    .then(response => {
                      let data = response.data.data;
                      let latestID = 0;
                      data.forEach(item => {
                        const itemID = parseInt(item.id);
                        if (itemID > latestID) {
                          latestID = itemID;
                        }
                      });
                      const now = new Date();
                      const year = now.getFullYear().toString().substr(-2);
                      const month = ('0' + (now.getMonth() + 1)).slice(-2);
                      const noStruk = `${year}.${month}.${latestID}`;
                      const printContents = `
                          <div style="width: 400px; height: 250px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                            <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 15px; color: #4CAF50;">
                              Go-Fit
                            </div>
                            <div style="text-align: center; font-weight: bold; font-size: 24px; margin-bottom: 20px;">Member Card</div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight: bold; color: #4CAF50;">No Struk:</div>
                              <div>${noStruk}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight: bold; color: #4CAF50;">Nomor Member:</div>
                              <div>${nomorMember}/${this.formMember.nama_member}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight: bold; color: #4CAF50;">Aktivasi Tahunan:</div>
                              <div>Rp.3.000.000</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight: bold; color: #4CAF50;">Masa Aktif:</div>
                              <div>${date}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                              <div style="font-weight: bold; color: #4CAF50;">Kasir:</div>
                              <div style="font-size: 16px;">${this.namapegawai}</div>
                            </div>
                        </div>
                        `;
                        // Create a new window to print the member card
                        let toast = createToastInterface();
                        toast.success("Generating MemberCard", {
                          timeout: 2000
                        });
                        setTimeout(() => {
                          const printWindow = window.open('', 'Print Window', 'height=400,width=600');
                          // Write the print contents to the new window
                          printWindow.document.write(printContents);
                          const printWidth = 400; // Width of print window
                          const printHeight = 250.2; // Height of print window
                          const pdf = new jsPDF({
                            orientation: printWidth > printHeight ? "landscape" : "portrait",
                            unit: "px",
                            format: [printWidth, printHeight]
                          });
                          // Add the print contents to the PDF document
                          pdf.html(printContents, {
                            callback: function () {
                              // Print the PDF document
                              pdf.autoPrint();
                              // Save the PDF document to a file
                              pdf.save('member_card_'+this.formMember.nama_member+'.pdf');
                            }
                          });
                          // Wait for the window to load and then call the print method
                          printWindow.onload = function() {
                              printWindow.print();
                          };
                        }, 2000);
                    })
                    .catch(error => {
                      console.log(`Error: ${error}`);
                    });
                        
                } 
            }).catch(error => {
                console.error(error);
            })
              // Handle successful response
            // toast.success("Data Berhasil Ditambahkan", {
            //   timeout: 2000
            // });
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
      }
    },
  },
  watch: {
    inputTotal: function(newValue) {
      this.remainingTotalValue = newValue >= this.defaultTotal ? newValue - this.defaultTotal : 0;
    },
    defaultTotal: function(newValue) {
      this.remainingTotalValue = this.inputTotal >= newValue ? this.inputTotal - newValue : 0;
    },
    "formTodo.nama_member": function(newValue) {
      this.getMemberData(newValue);
    },
    "formMember.status": function(newValue) {
      if (newValue === 'deactive') {
        this.expiryDate = "2024-12-31"; // set default expiry date to Dec 31, 2024
      } else {
        this.expiryDate = this.formMember.Expiration_Date;
      }
    },
    formTodo: {
      handler(newVal) {
        console.log("namaKelas:", newVal.nama_kelas);
        console.log("jumlah_deposit:", this.jumlah_deposit);
        this.updateTotalHarga(this.jumlah_deposit, newVal.nama_kelas);
      },
      deep: true
    },
    jumlah_deposit: function(newVal) {
      console.log("jumlah_deposit changed: ", newVal);
      if (this.formTodo.nama_kelas && newVal) {
        const selectedKelas = this.formKelas.find(kelas => kelas.nama_kelas == this.formTodo.nama_kelas.toString());
        console.log("selectedKelas: ", selectedKelas);
        if (selectedKelas) {
          this.formdepositKelas.total_harga = selectedKelas.tarif * newVal;
        } else {
          this.formdepositKelas.total_harga = 0;
        }
      }
      this.updateTotalHarga(newVal, this.formTodo.nama_kelas);
    },
  },
};
</script>
<style>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.activate-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.row {
  display: flex;
  margin-bottom: 20px;
}

.col {
  flex: 1;
  margin-right: 20px;
}

.col:last-child {
  margin-right: 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}

button.activate-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.activate-button:hover {
  background-color: #3e8e41;
}

.success-message {
  margin-top: 20px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  color: #3c763d;
  padding: 15px;
  border-radius: 5px;
}

.error-message {
  margin-top: 20px;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  color: #a94442;
  padding: 15px;
  border-radius: 5px;
}

.autocomplete {
  /*the container must be positioned relative:*/
  position: relative;
  display: inline-block;
}

.autocomplete-items {
  position: absolute;
  border-radius: 5px;
  border: 1px solid #d4d4d4;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
}

.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}

/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .form-row label {
    width: 150px;
  }
  
  .form-row v-autocomplete {
    flex: 1;
  }

/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: DodgerBlue !important;
  color: #ffffff;
}

.status-box {
  border: 1px solid #ccc;
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;
  font-weight: bold;
}
.customfield {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}

</style>