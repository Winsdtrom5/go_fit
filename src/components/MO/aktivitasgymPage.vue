<template>
  <div>
    <h1>GoFit</h1>
    <p>Jl. Centralpark No. 10 Yogyakarta</p>
    <h2 class="section-title">Laporan Bulanan Gym Member</h2>
    <v-autocomplete
      v-model="selectedMonth"
      :items="months"
      label="Select Month"
      outlined
    ></v-autocomplete>
    <v-autocomplete
      v-model="selectedYear"
      :items="years"
      label="Select Year"
      outlined
    ></v-autocomplete>

    <v-btn
      v-if="selectedMonth && selectedYear"
      @click="showDialog"
      color="brown"
      dark
      class="mt-4"
    >
      Preview
    </v-btn>

    <v-dialog v-model="dialogVisible">
      <v-card>
        <div>
          <h1>GoFit</h1>
          <p>Jl. Centralpark No. 10 Yogyakarta</p>

          <h2>LAPORAN AKTIVITAS GYM BULANAN</h2>
          <p>Bulan: {{ selectedMonth }} Tahun: {{ selectedYear }}</p>

          <!-- Table -->
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jumlah Member</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in aktivitasData" :key="item.tanggal">
                <td>{{ item.tanggal }}</td>
                <td>{{ item.jumlahMember }}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td>{{ calculateTotal() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <v-btn color="brown" dark @click="printTable"> Print </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      aktivitasData: [],
      selectedMonth: "",
      selectedYear: "",
      months: [],
      years: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.fetchMonth();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.fetchData(this.selectedMonth,this.selectedYear);
    },
    calculateTotal() {
      return this.aktivitasData.reduce((total, item) => {
        return total + item.jumlahMember;
      }, 0);
    },
    fetchMonth() {
      const request = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/presensigym"
      );

      request
        .then((response) => {
          const aktivitasgymData = response.data.data;
          const monthsSet = new Set();
          const yearsSet = new Set();

          aktivitasgymData.forEach((jadwal) => {
            const tanggal = jadwal.tanggal;
            const parts = tanggal.split("-");
            const year = parts[0];
            const month = this.getMonthInIndonesian(parts[1]);
            monthsSet.add(month);
            yearsSet.add(year);
          });

          this.months = Array.from(monthsSet);
          this.years = Array.from(yearsSet);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    getMonthInIndonesian(month) {
      const indonesianMonths = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthIndex = parseInt(month) - 1;
      return indonesianMonths[monthIndex];
    },
    fetchData(bulan, tahun) {
      const request1 = axios.get(
        `http://192.168.1.5/Server_Go_Fit/public/aktivitasgym/${bulan}/${tahun}`
      );

      Promise.all([request1])
        .then(([response1]) => {
          console.log(response1.data.data);
          const aktivitas = response1.data.data;
          const filteredData = aktivitas.map((item) => ({
            tanggal: item.tanggal,
            jumlahMember: item.jumlahMember,
          }));
          this.aktivitasData = filteredData;
          console.log(this.aktivitasData)
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    printTable() {
      const currentDate = this.getCurrentDate();

      const printContents = `
        <html>
          <head>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                  margin-bottom: 20px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                h1, h2, p {
                  margin: 0;
                }
                .right-align {
                  text-align: right;
                }
              }
            </style>
          </head>
          <body>
            <h1>GoFit</h1>
            <p>Jl. Centralpark No. 10 Yogyakarta</p>
            <br>
            <h2>LAPORAN AKTIVITAS GYM BULANAN</h2>
            <br>
            <p>PERIODE: ${this.selectedMonth} ${this.selectedYear}</p>
            <p>Tanggal cetak: ${currentDate}</p>
            <br>
            <br>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jumlah Member</th>
                </tr>
              </thead>
              <tbody>
                ${this.aktivitasData
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.tanggal}</td>
                        <td>${item.jumlahMember}</td>
                      </tr>
                    `
                  )
                  .join("")}
                <tr>
                  <td colspan="2" class="right-align"><strong>Total</strong></td>
                  <td class="right-align">${this.calculateTotal()}</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;

      const popup = window.open("", "_blank");
      if (popup) {
        popup.document.open();
        popup.document.write(printContents);
        popup.document.close();
        popup.focus();
        popup.print();
      } else {
        console.error("Failed to open a new window.");
      }
    },
    getCurrentDate() {
      const date = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("id-ID", options);
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  font-weight: bold;
}

h2 {
  font-size: 18px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
}

v-chart {
  height: 300px;
  width: 100%;
}

.v-btn {
  margin-top: 20px;
}

.spacing {
  height: 20px;
}

.button-section {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.secondary-btn {
  margin-left: 10px;
}
</style>
