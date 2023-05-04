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
        <button class="activate-button" @click="activateMember">Activate Membership</button>
        <div class="row mt-3">
          <div class="col">
            <label for="total-price">Total Harga</label>
            <input id="total-price" type="text" v-model="defaultTotal" readonly/>
          </div>
           <div class="col">
            <label for="paid-amount">Input Harga</label>
            <input id="paid-amount" type="text" v-model="inputTotal"/>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label for="remaining-amount">Sisa Harga</label>
            <input id="remaining-amount" type="text" :value="remainingTotal" readonly/>
          </div>
        </div>
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
                  <input id="bayar" class="customfield" type="text" v-model="bayar" />
                </div>
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
import axios from "axios";

export default {
  data() {
    return {
      formMember: {
          id_member:null,
          nama_member: null,
          password:null,
          umur: null,
          email: null,
          no_telp:null,
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
      kelasOptions: [],
      membershipNumber: "",
      expiryDate: "",
      isActivated: false,
      errorMessage: "",
      showDepositKelas: false,
      showDepositUang: false,
      jumlah_deposit: 0,
    };
  },
  computed: {
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
    defaultTotal() {
      return this.formMember.status === 'deactive' ? '3.000.000' : this.Total;
    },
    isMemberNameDisabled() {
    return !this.formTodo.nama_member;
    },
  },
  mounted() {
    this.loadMemberOptions();
    this.loadKelasOptions();
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
      axios.get('http://192.168.1.5/Server_Go_Fit/public/kelas')
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
      axios.get('http://192.168.1.5/Server_Go_Fit/public/member')
        .then(response => {
          // map response data to an array of options
          this.members = response.data.data.map((member) => {
            return {
              id_member: member.id_member,
              nama_member: member.nama_member,
              password: member.password,
              umur: member.umur,
              email: member.email,
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
      axios.get('http://192.168.1.5/Server_Go_Fit/public/member')
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
      // call API to activate the member's membership
      axios.put('http://192.168.1.5/Server_Go_Fit/public/member/' + this.formMember.id_member, {
        Expiration_Date: this.expiryDate,
        status: 'active',
      })
      .then(response => {
        this.isActivated = true;
        this.errorMessage = "";
        console.log(response);
      })
      .catch(error => {
        console.error(error);
        this.isActivated = false;
        this.errorMessage = "Failed to activate membership. Please try again.";
      });
    },
  },
  watch: {
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
