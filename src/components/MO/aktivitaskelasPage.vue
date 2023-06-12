<template>
  <div>
    <h1>GoFit</h1>
    <p>Jl. Centralpark No. 10 Yogyakarta</p>
    <h2 class="section-title">Laporan Bulanan Kelas Gym</h2>
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

          <h2>LAPORAN AKTIVITAS KELAS BULANAN</h2>
          <p>Bulan: {{ selectedMonth }} Tahun: {{ selectedYear }}</p>

          <!-- Table -->
          <table>
            <thead>
              <tr>
                <th>Kelas</th>
                <th>Instruktur</th>
                <th>Jumlah Peserta</th>
                <th>Jumlah libur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in aktivitasData" :key="item.bulan">
                <td>{{ item.nama_kelas }}</td>
                <td>{{ item.instruktur }}</td>
                <td>{{ item.jumlahPeserta }}</td>
                <td>{{ item.jumlahLibur }}</td>
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
      jadwalharianData: [],
      presensikelasData: [],
      filteredKelasData: [],
      currentDate: "",
      currentMonth: "",
      aktivitasData: [],
      selectedMonth: "",
      selectedYear: "",
      months: [],
      years: [],
      currentYear: "",
      dialogVisible: false,
    };
  },
  mounted() {
    this.fetchMonth();
  },
  computed: {
    groupedKelasData() {
      return this.filteredKelasData.reduce((grouped, kelasData, index) => {
        if (
          index === 0 ||
          kelasData.nama_kelas !== this.filteredKelasData[index - 1].nama_kelas
        ) {
          grouped.push([kelasData]);
        } else {
          grouped[grouped.length - 1].push(kelasData);
        }
        return grouped;
      }, []);
    },
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.fetchData(this.selectedMonth,this.selectedYear);
    },
    closeDialog() {
      this.dialogVisible = false;
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
    getCurrentYear() {
      const date = new Date();
      return date.getFullYear();
    },
    fetchMonth() {
      const request = axios.get(
        "https://gofit123.xyz/Server_Go_Fit/public/jadwalharian/a/a/a/a/showall"
      );

      request
        .then((response) => {
          const jadwalharianData = response.data.data;
          const monthsSet = new Set();
          const yearsSet = new Set(); // New Set to store unique years

          jadwalharianData.forEach((jadwal) => {
            const tanggal_kelas = jadwal.tanggal_kelas;
            const parts = tanggal_kelas.split(" ");
            const month = parts[1];
            const year = parts[2]; // Extract the year from the tanggal_kelas
            monthsSet.add(month);
            yearsSet.add(year); // Add the year to the Set
          });

          this.months = Array.from(monthsSet);
          this.years = Array.from(yearsSet); // Store the unique years in the component data
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    fetchData(bulan, tahun) {
      const request1 = axios.get(
        `https://gofit123.xyz/Server_Go_Fit/public/aktivitaskelas/${bulan}/${tahun}`
      );

      Promise.all([request1])
        .then(([response1]) => {
          console.log(response1.data.data);
          const aktivitas = response1.data.data;
          const filteredData = aktivitas.map((item) => ({
            nama_kelas: item.nama_kelas,
            instruktur: item.instruktur,
            jumlahPeserta: item.jumlahPeserta,
            jumlahLibur: item.jumlahLibur,
          }));

          this.aktivitasData = filteredData;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    printTable() {
            // Get the current year
      // Get the current year

      // Format the current date with Indonesian format (tanggal-bulan-tahun)
      const options = { day: "numeric", month: "long", year: "numeric" };
      const currentDate = new Date().toLocaleDateString("id-ID", options);

      const chartContainer = document.createElement("div");
      const chartCanvas = document.createElement("canvas");
      chartCanvas.id = "chartCanvas";
      chartContainer.appendChild(chartCanvas);

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
            <h2>LAPORAN AKTIVITAS KELAS BULANAN</h2>
            <br>
            <p>Bulan: ${this.selectedMonth} Tahun: ${this.selectedYear}</p>
            <p>Tanggal cetak: ${currentDate}</p>
            <br>
            <br>
            <table>
              <thead>
                <tr>
                  <th>Kelas</th>
                  <th>Instruktur</th>
                  <th>Jumlah Peserta</th>
                  <th>Jumlah Libur</th>
                </tr>
              </thead>
              <tbody>
                ${this.aktivitasData
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.nama_kelas}</td>
                        <td>${item.instruktur}</td>
                        <td>${item.jumlahPeserta}</td>
                        <td>${item.jumlahLibur}</td>
                      </tr>
                    `
                  )
                  .join("")}
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
.section-title {
  margin-top: 20px;
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
