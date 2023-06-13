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
        <input id="status" type="text" v-model="formMember.status" readonly />
      </div>
      <div class="col">
        <label for="expiry-date">Expired Date</label>
        <input
          id="expiry-date"
          type="text"
          v-model="formMember.Expiration_Date"
          readonly
        />
      </div>
    </div>
    <div class="button-container">
      <div v-if="formMember.status === 'deactive'">
        <div class="row mt-3">
          <div class="col">
            <label for="total-price">Total Harga</label>
            <input
              id="total-price"
              type="text"
              :value="defaultTotal"
              readonly
            />
          </div>
          <div class="col">
            <label for="paid-amount">Input Bayar</label>
            <input
              id="paid-amount"
              type="number"
              v-model="inputTotalValue"
              :min="defaultTotal"
            />
          </div>
          <div class="col">
            <label for="paid-amount">Kembalian</label>
            <input
              class="customfield"
              v-model="formAktivasi.kembalian"
              readonly
            />
          </div>
        </div>
        <button class="activate-button" @click="activateMember">
          Activate Membership
        </button>
      </div>
      <div v-if="formMember.status === 'active'">
        <div class="row">
          <div class="row mt-3">
            <div class="col">
              <button
                class="activate-button"
                @click="
                  showDepositKelas = true;
                  showDepositUang = false;
                "
                style="white-space: nowrap"
              >
                Deposit Kelas
              </button>
            </div>
            <div class="col">
              <button
                class="activate-button"
                @click="
                  showDepositKelas = false;
                  showDepositUang = true;
                "
                style="white-space: nowrap"
              >
                Deposit Uang
              </button>
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
              <div class="promo">
                <label for="deposit-kelas">Promo</label>
                <v-autocomplete
                  id="nama-kelas"
                  v-model="formTodo.promo"
                  :items="promoOptions"
                  item-text="nama_promo"
                  required
                ></v-autocomplete>
              </div>
              <div class="deposit-container">
                <label for="deposit-kelas">Deposit Kelas Input</label>
                <input
                  id="deposit-kelas"
                  class="customfield"
                  type="text"
                  v-model="jumlah_deposit"
                  readonly
                />
              </div>
              <div class="total-harga-container">
                <label for="total-price">Total Harga</label>
                <input
                  class="customfield"
                  v-model="formdepositKelas.total_harga"
                  readonly
                />
              </div>
            </div>
            <div v-if="showDepositKelas">
              <div class="bayar-container">
                <label for="deposit-kelas">Bayar</label>
                <input
                  id="deposit-kelas"
                  class="customfield"
                  type="text"
                  v-model="bayar"
                />
              </div>
              <div class="kembalian">
                <label for="deposit-kelas">kembalian</label>
                <input
                  id="deposit-kelas"
                  class="customfield"
                  type="text"
                  v-model="formdepositKelas.kembalian"
                />
              </div>
              <button class="activate-button" @click="depositkelas">
                Add Into Account
              </button>
            </div>
            <div v-if="showDepositUang" class="form-row">
              <div class="input-container">
                <label for="total-price">Input Deposit</label>
                <input class="customfield" v-model="formTodo.inputDeposit" />
              </div>
              <div class="sisa-container">
                <label for="total-price">Sisa Deposit</label>
                <input
                  class="customfield"
                  v-model="formdeposituang.jumlah_deposit"
                  readonly
                />
              </div>
              <div class="sisa-container">
                <label for="total-price">Bonus Deposit</label>
                <input
                  class="customfield"
                  v-model="formpromoreguler.bonus"
                  readonly
                />
              </div>
              <div class="sisa-container">
                <label for="total-price">Total Harga</label>
                <input
                  class="customfield"
                  v-model="formdeposituang.total"
                  readonly
                />
              </div>
            </div>
            <div v-if="showDepositUang">
              <div class="bayar-container">
                <label for="deposit-kelas">Bayar</label>
                <input
                  id="deposit-kelas"
                  class="customfield"
                  type="text"
                  v-model="formdeposituang.bayar"
                />
              </div>
              <div class="kembalian">
                <label for="deposit-kelas">kembalian</label>
                <input
                  id="deposit-kelas"
                  class="customfield"
                  type="text"
                  v-model="formdeposituang.kembalian"
                  readonly
                />
              </div>
              <button class="activate-button" @click="deposituang">
                Add Into Account
              </button>
            </div>
          </div>
        </div>
        <div class="row mt-3" v-if="showDepositKelas || showDepositUang">
          <div class="col"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import jsPDF from 'jspdf';
import axios from "axios";
import { createToastInterface } from "vue-toastification";
export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formMember: {
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
      },
      members: [],
      formTodo: {
        id: null,
        hari: null,
        jam: null,
        nama: null,
        nama_kelas: null,
        inputDeposit: 0,
      },
      formdeposituang: {
        id: null,
        kembalian: 0,
        total: 0,
        id_member: null,
        tanggal: null,
        jumlah_deposit: null,
        id_promo: null,
        id_pegawai: null,
        bayar: 0,
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
        kembalian: 0,
        promo: null,
      },
      formKelas: {
        id_kelas: null,
        nama_kelas: null,
        tarif: null,
      },
      formAktivasi: {
        nama_member: null,
        nama: null,
        kembalian: 0,
      },
      formpromoreguler: {
        id_promo: null,
        nama_promo: null,
        requiremnt: null,
        minimal: null,
        bonus: 0,
        deskripsi: null,
      },
      formpromopaket: {
        id_promo: null,
        nama_promo: null,
        requiremnt: null,
        minimal: null,
        batas_berlaku: null,
        bonus: null,
        deskripsi: null,
      },
      formPegawai: {
        id_pegawai: null,
        nama_pegawai: null,
        password: null,
        email: null,
        umur: null,
        jabatan: null,
        no_telp: null,
      },
      kelasOptions: [],
      promoOptions: [],
      membershipNumber: "",
      expiryDate: "",
      isActivated: false,
      errorMessage: "",
      showDepositKelas: false,
      showDepositUang: false,
      jumlah_deposit: 0,
      inputTotalValue: "",
      inputTotal: 0,
      remainingTotalValue: 0,
      bayar: 0,
      namapegawai: null,
      idpegawai: null,
    };
  },
  computed: {
    defaultTotal() {
      return this.formMember.status === "deactive" ? "3000000" : this.Total;
    },
    remainingTotal() {
      return this.remainingTotalValue.toLocaleString();
    },
    remainingTotalError() {
      return Number(this.remainingTotal) < 0;
    },
    selectedKelas() {
      return this.kelasOptions.find(
        (kelas) => kelas.nama_kelas === this.formTodo.nama_kelas
      );
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
    this.loadpaketOptions();
  },
  methods: {
    updateTotalHarga(jumlah_deposit, nama_kelas) {
      if (nama_kelas && jumlah_deposit) {
        const selectedKelas = this.kelasOptions.find(
          (kelas) => kelas.nama_kelas === nama_kelas.toString()
        );
        if (selectedKelas !== undefined && selectedKelas !== null) {
          this.formdepositKelas.total_harga =
            selectedKelas.tarif * jumlah_deposit;
        } else {
          this.formdepositKelas.total_harga = 0;
        }
      } else {
        this.formdepositKelas.total_harga = 0;
      }
    },
    loadKelasOptions() {
      // fetch data from kelas database
      axios
        .get("https://gofit123.xyz/Server_Go_Fit/public/kelas")
        .then((response) => {
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
        .catch((error) => {
          console.error(error);
        });
    },
    loadpaketOptions() {
      // fetch data from kelas database
      axios
        .get("https://gofit123.xyz/Server_Go_Fit/public/promopaket")
        .then((response) => {
          // map response data to an array of options
          this.promoOptions = response.data.data.map((promo) => {
            return {
              id_promo: promo.id_promo,
              nama_promo: promo.nama_promo,
              requirement: promo.requirement,
              minimal: promo.minimal,
              batas_berlaku: promo.batas_berlaku,
              bonus: promo.bonus,
              deskripsi: promo.deskripsi,
            };
          });
          // store the array of objects in formKelas
          this.formpromopaket = this.promoOptions;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    loadMemberOptions() {
      // fetch data from kelas database
      axios
        .get("https://gofit123.xyz/Server_Go_Fit/public/member")
        .then((response) => {
          // map response data to an array of options
          this.members = response.data.data.map((member) => {
            return {
              id_member: member.id_member,
              nama_member: member.nama_member,
              password: member.password,
              umur: member.umur,
              email: member.email,
              date_daftar: member.date_daftar,
              no_telp: member.no_telp,
              tanggal_lahir: member.tanggal_lahir,
              deposit_uang: member.deposit_uang,
              deposit_kelas: member.deposit_kelas,
              Expiration_Date: member.Expiration_Date,
              status: member.status,
            };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getMemberData(memberName) {
      axios
        .get("https://gofit123.xyz/Server_Go_Fit/public/member")
        .then((response) => {
          // filter the response data to find the member with matching nama_member
          const matchingMember = response.data.data.filter(
            (member) => member.nama_member === memberName
          )[0];

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
        .catch((error) => {
          console.error(error);
        });
    },
    deposituang() {
      if (this.formTodo.inputDeposit == 0) {
        let toast = createToastInterface();
        toast.error("Anda belum menambah uang untuk deposit", {
          timeout: 2000,
        });
        return;
      } else if (this.formdeposituang.bayar < this.formdeposituang.total) {
        let toast = createToastInterface();
        toast.error("Uang Anda Kurang", {
          timeout: 2000,
        });
        return;
      } else {
        const now = new Date();
        let formdeposituang = new FormData();
        axios
          .get(
            `https://gofit123.xyz/Server_Go_Fit/public/deposituang/${this.formTodo.nama_member}`
          )
          .then((response) => {
            let minimal = response.data.data.total_deposit;
            axios
              .get(
                `https://gofit123.xyz/Server_Go_Fit/public/promoreguler/${this.formTodo.inputDeposit}/${minimal}`
              )
              .then((response) => {
                console.log(response.data.data);
                formdeposituang.append(
                  "nama_member",
                  this.formTodo.nama_member
                );
                formdeposituang.append("email", this.username);
                formdeposituang.append(
                  "tanggal",
                  now.toISOString().slice(0, 10)
                );
                formdeposituang.append("harga", this.formdeposituang.total);
                console.log(this.formdeposituang.total);
                formdeposituang.append(
                  "jumlah_deposit",
                  this.formTodo.inputDeposit
                );
                if (this.formdeposituang.bonus != 0) {
                  let $data = response.data.data;
                  console.log($data.id_promo);
                  formdeposituang.append("promo", $data.id_promo);
                }
                console.log(formdeposituang);
                axios
                  .post(
                    "https://gofit123.xyz/Server_Go_Fit/public/deposituang",
                    formdeposituang
                  )
                  .then((response) => {
                    // Handle successful response
                    console.log(response.data);
                    axios
                      .get(
                        "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                          this.username,
                        {}
                      )
                      .then((response) => {
                        if (response && response.data && response.data.data) {
                          let data = response.data.data;
                          this.idpegawai = data[0].id_pegawai;
                          this.namapegawai = data[0].nama_pegawai;
                          axios
                            .get(
                              "https://gofit123.xyz/Server_Go_Fit/public/deposituang"
                            )
                            .then((response) => {
                              let data = response.data.data;
                              let latestID = 0;
                              data.forEach((item) => {
                                const itemID = parseInt(item.id);
                                if (itemID > latestID) {
                                  latestID = itemID;
                                }
                              });
                              const now = new Date();
                              const year = now
                                .getFullYear()
                                .toString()
                              const month = ("0" + (now.getMonth() + 1)).slice(
                                -2
                              );
                              const day = ("0" + now.getDate()).slice(-2);
                              const hours = ("0" + now.getHours()).slice(-2);
                              const minutes = ("0" + now.getMinutes()).slice(
                                -2
                              );
                              const currentDate = `${day}/${month}/${year}`;
                              const currentTime = `${hours}:${minutes}`;
                              const noStruk = `${year}.${month}.${latestID}`;
                              let dateDaftar = new Date(
                                this.formMember.date_daftar
                              );
                              let year2 = dateDaftar
                                .getFullYear()
                                .toString()
                                .slice(-2);
                              let month2 = (dateDaftar.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              let nomorMember =
                                year2 +
                                "." +
                                month2 +
                                "." +
                                this.formMember.id_member;
                              let sisa =
                                this.formdeposituang.jumlah_deposit.toLocaleString(
                                  "id-ID",
                                  { style: "currency", currency: "IDR" }
                                );
                              let bonus = Number(
                                this.formpromoreguler.bonus
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });

                              let jumlahdeposit = Number(
                                this.formTodo.inputDeposit
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });
                              axios
                                .get(
                                  `https://gofit123.xyz/Server_Go_Fit/public/deposituang/${this.formTodo.nama_member}`
                                )
                                .then((response) => {
                                  let data = response.data.data;
                                  let totalDeposit = data.total_deposit;
                                  let total = totalDeposit.toLocaleString(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }
                                  );
                                  console.log(total);
                                  const printContents = `
                                <div style="width: 700px; height: 300px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">Go-Fit</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">No Struk:</div>
                                          <div>${noStruk}</div>
                                        </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Tanggal:</div>
                                          <div>${currentDate} ${currentTime}</div>
                                        </div>
                                      </div>
                                      <br>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Member: ${nomorMember}/${this.formMember.nama_member}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Deposit: ${jumlahdeposit},- </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Bonus Deposit: ${bonus}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Sisa Deposit: ${sisa}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Total Deposit: ${total}</div>
                                      </div>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight: bold; color: #4CAF50;"></div>
                                          <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                                      </div>
                                  </div>
                                `;
                                  let toast = createToastInterface();
                                  toast.success("Deposit Kelas Sukses", {
                                    timeout: 2000,
                                  });
                                  setTimeout(() => {
                                    const popup = window.open("", "_blank");
                                    popup.document.write(printContents);
                                    popup.document.close();
                                    popup.focus();
                                    popup.print();
                                  }, 2000);
                                });
                            });
                          // Do something with the response data, e.g. show success message
                        }
                      });
                  });
                // if(this.formdeposituang.bonus != 0){
                //   const selectedpromo = this.promoOptions.find(
                //     (promo) =>
                //       promo.nama_promo == this.formTodo.promo.toString()
                //   );
                //   formdepositKelas.append("promo", selectedpromo.id_promo);
                //   console.log(selectedpromo.id_promo);
                // }
              })
              .catch((error) => {
                // Handle error response
                console.error(error);
                console.log(response.data.data);
                formdeposituang.append(
                  "nama_member",
                  this.formTodo.nama_member
                );
                formdeposituang.append("email", this.username);
                formdeposituang.append(
                  "tanggal",
                  now.toISOString().slice(0, 10)
                );
                formdeposituang.append("harga", this.formdeposituang.total);
                console.log(this.formdeposituang.total);
                formdeposituang.append(
                  "jumlah_deposit",
                  this.formTodo.inputDeposit
                );
                axios
                  .post(
                    "https://gofit123.xyz/Server_Go_Fit/public/deposituang",
                    formdeposituang
                  )
                  .then((response) => {
                    // Handle successful response
                    console.log(response.data);
                    axios
                      .get(
                        "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                          this.username,
                        {}
                      )
                      .then((response) => {
                        if (response && response.data && response.data.data) {
                          let data = response.data.data;
                          this.idpegawai = data[0].id_pegawai;
                          this.namapegawai = data[0].nama_pegawai;
                          axios
                            .get(
                              "https://gofit123.xyz/Server_Go_Fit/public/deposituang"
                            )
                            .then((response) => {
                              let data = response.data.data;
                              let latestID = 0;
                              data.forEach((item) => {
                                const itemID = parseInt(item.id);
                                if (itemID > latestID) {
                                  latestID = itemID;
                                }
                              });
                              const now = new Date();
                              const year = now
                                .getFullYear()
                                .toString()
                              const month = ("0" + (now.getMonth() + 1)).slice(
                                -2
                              );
                              const day = ("0" + now.getDate()).slice(-2);
                              const hours = ("0" + now.getHours()).slice(-2);
                              const minutes = ("0" + now.getMinutes()).slice(
                                -2
                              );
                              const currentDate = `${day}/${month}/${year}`;
                              const currentTime = `${hours}:${minutes}`;
                              const noStruk = `${year}.${month}.${latestID}`;
                              let dateDaftar = new Date(
                                this.formMember.date_daftar
                              );
                              let year2 = dateDaftar
                                .getFullYear()
                                .toString()
                                .slice(-2);
                              let month2 = (dateDaftar.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              let nomorMember =
                                year2 +
                                "." +
                                month2 +
                                "." +
                                this.formMember.id_member;
                              let sisa =
                                this.formdeposituang.jumlah_deposit.toLocaleString(
                                  "id-ID",
                                  { style: "currency", currency: "IDR" }
                                );
                              let bonus = Number(
                                this.formpromoreguler.bonus
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });

                              let jumlahdeposit = Number(
                                this.formTodo.inputDeposit
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });
                              axios
                                .get(
                                  `https://gofit123.xyz/Server_Go_Fit/public/deposituang/${this.formTodo.nama_member}`
                                )
                                .then((response) => {
                                  let data = response.data.data;
                                  let totalDeposit = data.total_deposit;
                                  let total = totalDeposit.toLocaleString(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }
                                  );
                                  console.log(total);
                                  const printContents = `
                                <div style="width: 700px; height: 300px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">Go-Fit</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">No Struk:</div>
                                          <div>${noStruk}</div>
                                        </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Tanggal:</div>
                                          <div>${currentDate} ${currentTime}</div>
                                        </div>
                                      </div>
                                      <br>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Member: ${nomorMember}/${this.formMember.nama_member}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Deposit: ${jumlahdeposit},- </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Bonus Deposit: ${bonus}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Sisa Deposit: ${sisa}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Total Deposit: ${total}</div>
                                      </div>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight: bold; color: #4CAF50;"></div>
                                          <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                                      </div>
                                  </div>
                                `;
                                  let toast = createToastInterface();
                                  toast.success("Deposit Kelas Sukses", {
                                    timeout: 2000,
                                  });
                                  setTimeout(() => {
                                    const popup = window.open("", "_blank");
                                    popup.document.write(printContents);
                                    popup.document.close();
                                    popup.focus();
                                    popup.print();
                                  }, 2000);
                                });
                            });
                          // Do something with the response data, e.g. show success message
                        }
                      });
                  });

                // Do something with the error, e.g. show error message
              });
          })
          .catch((error) => {
                // Handle error response
                console.error(error);
                formdeposituang.append(
                  "nama_member",
                  this.formTodo.nama_member
                );
                formdeposituang.append("email", this.username);
                formdeposituang.append(
                  "tanggal",
                  now.toISOString().slice(0, 10)
                );
                formdeposituang.append("harga", this.formdeposituang.total);
                console.log(this.formdeposituang.total);
                formdeposituang.append(
                  "jumlah_deposit",
                  this.formTodo.inputDeposit
                );
                axios
                  .post(
                    "https://gofit123.xyz/Server_Go_Fit/public/deposituang",
                    formdeposituang
                  )
                  .then((response) => {
                    // Handle successful response
                    console.log(response.data);
                    axios
                      .get(
                        "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                          this.username,
                        {}
                      )
                      .then((response) => {
                        if (response && response.data && response.data.data) {
                          let data = response.data.data;
                          this.idpegawai = data[0].id_pegawai;
                          this.namapegawai = data[0].nama_pegawai;
                          axios
                            .get(
                              "https://gofit123.xyz/Server_Go_Fit/public/deposituang"
                            )
                            .then((response) => {
                              let data = response.data.data;
                              let latestID = 0;
                              data.forEach((item) => {
                                const itemID = parseInt(item.id);
                                if (itemID > latestID) {
                                  latestID = itemID;
                                }
                              });
                              const now = new Date();
                              const year = now
                                .getFullYear()
                                .toString()
                              const month = ("0" + (now.getMonth() + 1)).slice(
                                -2
                              );
                              const day = ("0" + now.getDate()).slice(-2);
                              const hours = ("0" + now.getHours()).slice(-2);
                              const minutes = ("0" + now.getMinutes()).slice(
                                -2
                              );
                              const currentDate = `${day}/${month}/${year}`;
                              const currentTime = `${hours}:${minutes}`;
                              const noStruk = `${year}.${month}.${latestID}`;
                              let dateDaftar = new Date(
                                this.formMember.date_daftar
                              );
                              let year2 = dateDaftar
                                .getFullYear()
                                .toString()
                                .slice(-2);
                              let month2 = (dateDaftar.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              let nomorMember =
                                year2 +
                                "." +
                                month2 +
                                "." +
                                this.formMember.id_member;
                              let sisa =
                                this.formdeposituang.jumlah_deposit.toLocaleString(
                                  "id-ID",
                                  { style: "currency", currency: "IDR" }
                                );
                              let bonus = Number(
                                this.formpromoreguler.bonus
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });

                              let jumlahdeposit = Number(
                                this.formTodo.inputDeposit
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              });
                              axios
                                .get(
                                  `https://gofit123.xyz/Server_Go_Fit/public/deposituang/${this.formTodo.nama_member}`
                                )
                                .then((response) => {
                                  let data = response.data.data;
                                  let totalDeposit = data.total_deposit;
                                  let total = totalDeposit.toLocaleString(
                                    "id-ID",
                                    { style: "currency", currency: "IDR" }
                                  );
                                  console.log(total);
                                  const printContents = `
                                <div style="width: 700px; height: 300px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">Go-Fit</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold; ">No Struk:</div>
                                          <div>${noStruk}</div>
                                        </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                                        </div>
                                        <div style="display: flex; align-items: center;">
                                          <div style="font-weight: bold;">Tanggal:</div>
                                          <div>${currentDate} ${currentTime}</div>
                                        </div>
                                      </div>
                                      <br>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Member: ${nomorMember}/${this.formMember.nama_member}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight;">Deposit: ${jumlahdeposit},- </div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Bonus Deposit: ${bonus}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Sisa Deposit: ${sisa}</div>
                                      </div>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight; ">Total Deposit: ${total}</div>
                                      </div>
                                      <br>
                                      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                        <div style="font-weight: bold; color: #4CAF50;"></div>
                                          <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                                      </div>
                                  </div>
                                `;
                                  let toast = createToastInterface();
                                  toast.success("Deposit Kelas Sukses", {
                                    timeout: 2000,
                                  });
                                  setTimeout(() => {
                                    const popup = window.open("", "_blank");
                                    popup.document.write(printContents);
                                    popup.document.close();
                                    popup.focus();
                                    popup.print();
                                  }, 2000);
                                });
                            });
                          // Do something with the response data, e.g. show success message
                        }
                      });
                  });

                // Do something with the error, e.g. show error message
              });
      }
    },
    depositkelas() {
      if (!this.formTodo.nama_kelas) {
        let toast = createToastInterface();
        toast.error("Anda belum memilih kelas untuk deposit", {
          timeout: 2000,
        });
        return;
      } else if (!this.formTodo.promo) {
        let toast = createToastInterface();
        toast.error("Anda belum menentukan paket deposit", {
          timeout: 2000,
        });
        return;
      } else if (this.bayar < this.formdepositKelas.total_harga) {
        console.log(this.inputTotal);
        console.log(this.defaultTotal);
        let toast = createToastInterface();
        toast.error("Uang Anda Kurang", {
          timeout: 2000,
        });
        return;
      } else {
        let today = new Date();
        let formdepositKelas = new FormData();
        axios
          .get(
            `https://gofit123.xyz/Server_Go_Fit/public/depositkelas/${this.formTodo.nama_member}/${this.formTodo.nama_kelas}`
          )
          .then((response) => {
            console.log(response.data);
            let minimal = response.data.data.total_deposit;
            axios
              .get(
                `https://gofit123.xyz/Server_Go_Fit/public/promopaket/${this.formTodo.promo}/${minimal}`
              )
              .then((response) => {
                console.log(response.data);
                formdepositKelas.append(
                  "nama_member",
                  this.formTodo.nama_member
                );
                formdepositKelas.append("email", this.username);
                formdepositKelas.append(
                  "tanggal",
                  today.toISOString().slice(0, 10)
                );
                formdepositKelas.append(
                  "harga",
                  this.formdepositKelas.total_harga
                );
                formdepositKelas.append("nama_kelas", this.formTodo.nama_kelas);
                formdepositKelas.append("jumlah_deposit", this.jumlah_deposit);
                if (this.formTodo.promo) {
                  const selectedpromo = this.promoOptions.find(
                    (promo) =>
                      promo.nama_promo == this.formTodo.promo.toString()
                  );
                  formdepositKelas.append("promo", selectedpromo.id_promo);
                  console.log(selectedpromo.id_promo);
                }
                axios
                  .post(
                    "https://gofit123.xyz/Server_Go_Fit/public/depositkelas",
                    formdepositKelas
                  )
                  .then((response) => {
                    // Handle successful response
                    console.log(response.data);
                    axios
                      .get(
                        "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                          this.username,
                        {}
                      )
                      .then((response) => {
                        if (response && response.data && response.data.data) {
                          let data = response.data.data;
                          this.idpegawai = data[0].id_pegawai;
                          this.namapegawai = data[0].nama_pegawai;
                          axios
                            .get(
                              "https://gofit123.xyz/Server_Go_Fit/public/depositkelas"
                            )
                            .then((response) => {
                              let data = response.data.data;
                              let latestID = 0;
                              let batas = null;
                              let jumlah = null;
                              data.forEach((item) => {
                                const itemID = parseInt(item.id);
                                if (itemID > latestID) {
                                  latestID = itemID;
                                  batas = item.batas_berlaku;
                                  jumlah = item.jumlah_deposit;
                                }
                              });
                              const now = new Date();
                              const year = now
                                .getFullYear()
                                .toString()
                                .substr(-2);
                              const month = ("0" + (now.getMonth() + 1)).slice(
                                -2
                              );
                              const day = ("0" + now.getDate()).slice(-2);
                              const hours = ("0" + now.getHours()).slice(-2);
                              const minutes = ("0" + now.getMinutes()).slice(
                                -2
                              );
                              const currentDate = `${day}/${month}/${year}`;
                              const currentTime = `${hours}:${minutes}`;
                              const noStruk = `${year}.${month}.${latestID}`;
                              let dateDaftar = new Date(
                                this.formMember.date_daftar
                              );
                              let year2 = dateDaftar
                                .getFullYear()
                                .toString()
                                .slice(-2);
                              let month2 = (dateDaftar.getMonth() + 1)
                                .toString()
                                .padStart(2, "0");
                              let nomorMember =
                                year2 +
                                "." +
                                month2 +
                                "." +
                                this.formMember.id_member;
                              let total =
                                this.formdepositKelas.total_harga.toLocaleString(
                                  "id-ID",
                                  { style: "currency", currency: "IDR" }
                                );
                              const selectedKelas = this.formKelas.find(
                                (kelas) =>
                                  kelas.nama_kelas ==
                                  this.formTodo.nama_kelas.toString()
                              );
                              console.log("selectedKelas: ", selectedKelas);
                              let harga = selectedKelas.tarif.toLocaleString(
                                "id-ID",
                                { style: "currency", currency: "IDR" }
                              );
                              const printContents = `
                              <div style="width: 700px; height: 300px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold; ">Go-Fit</div>
                                      </div>
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold; ">No Struk:</div>
                                        <div>${noStruk}</div>
                                      </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                                      </div>
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold;">Tanggal:</div>
                                        <div>${currentDate} ${currentTime}</div>
                                      </div>
                                    </div>
                                    <br>
                                    <br>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight;">Member: ${nomorMember}/${this.formMember.nama_member}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight;">Deposit Kelas (${this.formTodo.promo}): ${total},-(${this.jumlah_deposit} x ${harga}) </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">jenis Kelas: ${this.formTodo.nama_kelas}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">Total Deposit Kelas: ${jumlah}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">Batas Berlaku: ${batas}</div>
                                    </div>
                                    <br>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight: bold; color: #4CAF50;"></div>
                                        <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                                    </div>
                                </div>
                              `;
                              let toast = createToastInterface();
                              toast.success("Deposit Kelas Sukses", {
                                timeout: 2000,
                              });
                              setTimeout(() => {
                                const popup = window.open("", "_blank");
                                popup.document.write(printContents);
                                popup.document.close();
                                popup.focus();
                                popup.print();
                              }, 2000);
                            });
                          // Do something with the response data, e.g. show success message
                        }
                      })
                      .catch((error) => {
                        // Handle error response
                        console.error(error);
                        // Do something with the error, e.g. show error message
                      });
                  });
              })
              .catch((error) => {
                console.error(error);
                let toast = createToastInterface();
                toast.error("Tidak memenuhi syarat paket", {
                  timeout: 2000,
                });
                return;
              });
          })
          .catch((error) => {
            console.error(error);
            formdepositKelas.append("nama_member", this.formTodo.nama_member);
            formdepositKelas.append("email", this.username);
            formdepositKelas.append("tanggal",today.toISOString().slice(0, 10));
            formdepositKelas.append("harga", this.formdepositKelas.total_harga);
            formdepositKelas.append("nama_kelas", this.formTodo.nama_kelas);
            formdepositKelas.append("jumlah_deposit", this.jumlah_deposit);
            const selectedpromo = this.promoOptions.find(
              (promo) => promo.nama_promo == this.formTodo.promo.toString()
            );
            formdepositKelas.append("promo", selectedpromo.id_promo);
            console.log(selectedpromo.id_promo);
            axios
              .post(
                "https://gofit123.xyz/Server_Go_Fit/public/depositkelas",
                formdepositKelas
              )
              .then((response) => {
                // Handle successful response
                console.log(response.data);
                console.log(response.data);
                axios
                  .get(
                    "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                      this.username,
                    {}
                  )
                  .then((response) => {
                    if (response && response.data && response.data.data) {
                      let data = response.data.data;
                      this.idpegawai = data[0].id_pegawai;
                      this.namapegawai = data[0].nama_pegawai;
                      axios
                        .get(
                          "https://gofit123.xyz/Server_Go_Fit/public/depositkelas"
                        )
                        .then((response) => {
                          let data = response.data.data;
                          let latestID = 0;
                          let batas = null;
                          let jumlah = null;
                          data.forEach((item) => {
                            const itemID = parseInt(item.id);
                            if (itemID > latestID) {
                              latestID = itemID;
                              batas = item.batas_berlaku;
                              jumlah = item.jumlah_deposit;
                            }
                          });
                          const now = new Date();
                          const year = now.getFullYear().toString();
                          const month = ("0" + (now.getMonth() + 1)).slice(-2);
                          const day = ("0" + now.getDate()).slice(-2);
                          const hours = ("0" + now.getHours()).slice(-2);
                          const minutes = ("0" + now.getMinutes()).slice(-2);
                          const currentDate = `${day}/${month}/${year}`;
                          const currentTime = `${hours}:${minutes}`;
                          const noStruk = `${year}.${month}.${latestID}`;
                          let dateDaftar = new Date(
                            this.formMember.date_daftar
                          );
                          let year2 = dateDaftar
                            .getFullYear()
                            .toString()
                            .slice(-2);
                          let month2 = (dateDaftar.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          let nomorMember =
                            year2 +
                            "." +
                            month2 +
                            "." +
                            this.formMember.id_member;
                          let total =
                            this.formdepositKelas.total_harga.toLocaleString(
                              "id-ID",
                              { style: "currency", currency: "IDR" }
                            );
                          const selectedKelas = this.formKelas.find(
                            (kelas) =>
                              kelas.nama_kelas ==
                              this.formTodo.nama_kelas.toString()
                          );
                          console.log("selectedKelas: ", selectedKelas);
                          let harga = parseInt(
                            selectedKelas.tarif
                          ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          });
                          const printContents = `
                              <div style="width: 700px; height: 300px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold; ">Go-Fit</div>
                                      </div>
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold; ">No Struk:</div>
                                        <div>${noStruk}</div>
                                      </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                                      </div>
                                      <div style="display: flex; align-items: center;">
                                        <div style="font-weight: bold;">Tanggal:</div>
                                        <div>${currentDate} ${currentTime}</div>
                                      </div>
                                    </div>
                                    <br>
                                    <br>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight;">Member: ${nomorMember}/${this.formMember.nama_member}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight;">Deposit Kelas (${this.formTodo.promo}): ${total},-(${this.jumlah_deposit} x ${harga}) </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">jenis Kelas: ${this.formTodo.nama_kelas}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">Total Deposit Kelas: ${jumlah}</div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight; ">Batas Berlaku: ${batas}</div>
                                    </div>
                                    <br>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                      <div style="font-weight: bold; color: #4CAF50;"></div>
                                        <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                                    </div>
                                </div>
                              `;
                          let toast = createToastInterface();
                          toast.success("Deposit Kelas Sukses", {
                            timeout: 2000,
                          });
                          setTimeout(() => {
                            const popup = window.open("", "_blank");
                            popup.document.write(printContents);
                            popup.document.close();
                            popup.focus();
                            popup.print();
                          }, 2000);
                        });
                      // Do something with the response data, e.g. show success message
                    }
                  })
                  .catch((error) => {
                    // Handle error response
                    console.error(error);
                    // Do something with the error, e.g. show error message
                  });
                // Do something with the response data, e.g. show success message
              })
              .catch((error) => {
                // Handle error response
                console.error(error);
                // Do something with the error, e.g. show error message
              });
          });
      }
    },
    activateMember() {
      if (this.inputTotalValue < this.defaultTotal) {
        console.log(this.inputTotal);
        console.log(this.defaultTotal);
        let toast = createToastInterface();
        toast.error("Uang Anda Kurang", {
          timeout: 2000,
        });
        return;
      } else {
        // call API to activate the member's membership
        let today = new Date();
        // let options = { timeZone: 'Asia/Jakarta' };
        // let dateTimeWIB = today.toLocaleString('id-ID', options);
        let nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        let date = new Date(
          nextYear.getTime() - today.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10); // format as yyyy-mm-dd
        axios
          .put(
            `https://gofit123.xyz/Server_Go_Fit/public/member/${this.formTodo.id_member}/editdata`,
            {
              Expiration_Date: date,
              status: "active",
            }
          )
          .then((response) => {
            this.isActivated = true;
            this.errorMessage = "";
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
            this.isActivated = false;
            this.errorMessage =
              "Failed to activate membership. Please try again.";
            return;
          });
        let formAktivasi = new FormData();
        formAktivasi.append("nama_member", this.formTodo.nama_member);
        formAktivasi.append("nama", this.username);
        formAktivasi.append("tanggal", today.toISOString().slice(0, 10));
        formAktivasi.append("harga", 3000000);
        console.log(formAktivasi);
        axios
          .post(
            "https://gofit123.xyz/Server_Go_Fit/public/aktivasi",
            formAktivasi
          )
          .then((response) => {
            console.log(this.formMember.date_daftar);
            let dateDaftar = new Date(this.formMember.date_daftar);
            let year = dateDaftar.getFullYear().toString().slice(-2);
            let month = (dateDaftar.getMonth() + 1).toString().padStart(2, "0");
            let nomorMember =
              year + "." + month + "." + this.formMember.id_member;
            axios
              .get(
                "https://gofit123.xyz/Server_Go_Fit/public/pegawai/" +
                  this.username,
                {}
              )
              .then((response) => {
                if (response && response.data && response.data.data) {
                  let data = response.data.data;
                  this.idpegawai = data[0].id_pegawai;
                  this.namapegawai = data[0].nama_pegawai;
                  axios
                    .get("https://gofit123.xyz/Server_Go_Fit/public/aktivasi")
                    .then((response) => {
                      let data = response.data.data;
                      let latestID = 0;
                      data.forEach((item) => {
                        const itemID = parseInt(item.id);
                        if (itemID > latestID) {
                          latestID = itemID;
                        }
                      });
                      const now = new Date();
                      const year = now.getFullYear().toString();
                      const month = ("0" + (now.getMonth() + 1)).slice(-2);
                      const day = ("0" + now.getDate()).slice(-2);
                      const hours = ("0" + now.getHours()).slice(-2);
                      const minutes = ("0" + now.getMinutes()).slice(-2);
                      const currentDate = `${day}/${month}/${year}`;
                      const currentTime = `${hours}:${minutes}`;
                      const noStruk = `${year}.${month}.${latestID}`;
                      const printContents = `
                          <div style="width: 700px; height: 250px; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="display: flex; align-items: center;">
                                <div style="font-weight: bold; ">Go-Fit</div>
                              </div>
                              <div style="display: flex; align-items: center;">
                                <div style="font-weight: bold; ">No Struk:</div>
                                <div>${noStruk}</div>
                              </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="display: flex; align-items: center;">
                                <div style="font-weight: bold;">Jl. Centralpark No. 10 Yogyakarta</div>
                              </div>
                              <div style="display: flex; align-items: center;">
                                <div style="font-weight: bold;">Tanggal:</div>
                                <div>${currentDate} ${currentTime}</div>
                              </div>
                            </div>
                            <br>
                            <br>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight;">Nomor Member: ${nomorMember}/${this.formMember.nama_member}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight;">Aktivasi Tahunan: Rp.3.000.000</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight; ">Masa Aktif Member: ${date}</div>
                            </div>
                            <br>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                              <div style="font-weight: bold; color: #4CAF50;"></div>
                                <div style="font-size: 16px; text-align: right;">Kasir: P${this.idpegawai} / ${this.namapegawai}</div>
                            </div>
                        </div>
                        `;
                      // Create a new window to print the member card
                      let toast = createToastInterface();
                      toast.success("Generating Struk Aktivasi", {
                        timeout: 2000,
                      });
                      setTimeout(() => {
                        // const printWindow = window.open('', 'Print Window', 'height=400,width=600');
                        // // Write the print contents to the new window
                        // printWindow.document.write(printContents);
                        // const printWidth = 400; // Width of print window
                        // const printHeight = 600; // Height of print window
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
                        //     pdf.save('struk.pdf');
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
                      }, 2000);
                    })
                    .catch((error) => {
                      console.log(`Error: ${error}`);
                    });
                }
              })
              .catch((error) => {
                console.error(error);
              });
            console.log(response.data);
            this.resetForm();
            this.dialog = false;
            this.loadMemberOptions();
            // window.location.reload();
            // Do something with the response data, e.g. show success message
          })
          .catch((error) => {
            // Handle error response
            console.error(error);
            // Do something with the error, e.g. show error message
          });
      }
    },
  },
  watch: {
    inputTotal: function (newValue) {
      this.remainingTotalValue =
        newValue >= this.defaultTotal ? newValue - this.defaultTotal : 0;
    },
    defaultTotal: function (newValue) {
      this.remainingTotalValue =
        this.inputTotal >= newValue ? this.inputTotal - newValue : 0;
    },
    "formTodo.nama_member": function (newValue) {
      this.getMemberData(newValue);
      axios
        .get(
          "https://gofit123.xyz/Server_Go_Fit/public/deposituang/" + newValue,
          {}
        )
        .then((response) => {
          let data = response.data.data;
          this.formdeposituang.jumlah_deposit = data.total_deposit;
        })
        .catch((error) => {
          this.formdeposituang.jumlah_deposit = 0;
          console.error(error);
        });
    },
    "formMember.status": function (newValue) {
      if (newValue === "deactive") {
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
      deep: true,
    },
    "formTodo.inputDeposit": function (newVal) {
      this.formdeposituang.total = newVal;
      axios
        .get("https://gofit123.xyz/Server_Go_Fit/public/promoreguler")
        .then((response) => {
          const data = response.data.data;
          const promo = data.find(
            // You can change this condition as per your requirement
            (item) => item.minimal == newVal
          );
          if (promo) {
            this.formpromoreguler.bonus = promo.bonus;
          } else {
            this.formpromoreguler.bonus = 0;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // "formTodo.promo": function (newVal) {
    //   console.log("jumlah_deposit changed: ", newVal);
    //   if (this.formTodo.nama_kelas && newVal) {
    //     const selectedpaket = this.formpromopaket.find(
    //       (paket) => paket.nama_promo == this.formTodo.promo.toString()
    //     );
    //     console.log("selectedKelas: ", selectedpaket);
    //     if (selectedpaket) {
    //       this.jumlah_deposit = selectedpaket.minimal;
    //     }
    //   }
    // },
    jumlah_deposit: function (newVal) {
      console.log("jumlah_deposit changed: ", newVal);
      if (this.formTodo.nama_kelas && newVal) {
        const selectedKelas = this.formKelas.find(
          (kelas) => kelas.nama_kelas == this.formTodo.nama_kelas.toString()
        );
        console.log("selectedKelas: ", selectedKelas);
        if (selectedKelas) {
          this.formdepositKelas.total_harga = selectedKelas.tarif * newVal;
        } else {
          this.formdepositKelas.total_harga = 0;
        }
      }
      this.updateTotalHarga(newVal, this.formTodo.nama_kelas);
    },
    inputTotalValue: function (newVal) {
      console.log("jumlah_deposit changed: ", newVal);
      this.formAktivasi.kembalian = newVal - this.defaultTotal;
    },
    bayar: function (newVal) {
      this.formdepositKelas.kembalian =
        newVal - this.formdepositKelas.total_harga;
    },
    "formdeposituang.bayar": function (newVal) {
      this.formdeposituang.kembalian = newVal - this.formdeposituang.total;
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
  background-color: #4caf50;
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
