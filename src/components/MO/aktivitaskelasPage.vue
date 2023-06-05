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
    <v-btn
      v-if="selectedMonth"
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
          <p>Bulan: {{ selectedMonth }} Tahun: {{ currentYear }}</p>

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
              <template v-for="(group, groupIndex) in groupedKelasData">
                <tr :key="groupIndex">
                  <template v-for="(kelasData, index) in group">
                    <td v-if="index === 0" :rowspan="group.length" :key="index">
                      {{ kelasData.nama_kelas }}
                    </td>
                    <td :key="index + '_' + kelasData.instruktur">
                      {{ kelasData.instruktur }}
                    </td>
                    <td :key="index + '_' + kelasData.jumlahPeserta">
                      {{ kelasData.jumlahPeserta }}
                    </td>
                    <td :key="index + '_' + kelasData.jumlahLibur">
                      {{ kelasData.jumlahLibur }}
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
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
      selectedMonth: "",
      months: [],
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
      this.fetchData();
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
        "http://192.168.1.5/Server_Go_Fit/public/jadwalharian/a/a/a/a/showall"
      );

      request
        .then((response) => {
          const jadwalharianData = response.data.data;
          const monthsSet = new Set();

          jadwalharianData.forEach((jadwal) => {
            const tanggal_kelas = jadwal.tanggal_kelas;
            const parts = tanggal_kelas.split(" ");
            const month = parts[1];
            monthsSet.add(month);
          });

          this.months = Array.from(monthsSet);

          if (!this.selectedMonth) {
            this.selectedMonth = this.currentMonth;
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    fetchData() {
      const request1 = axios.get(
        `http://192.168.1.5/Server_Go_Fit/public/jadwalharian/a/a/a/a/showall`
      );
      const request2 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/presensikelas"
      );

      Promise.all([request1, request2])
        .then(([response1, response2]) => {
          const jadwalharianData = response1.data.data;
          const presensikelasData = response2.data.data;
          const filteredKelasData = [];
          const selectedMonth = this.selectedMonth;

          jadwalharianData.forEach((jadwal) => {
            const { nama_kelas, nama, status, tanggal } = jadwal;

            // Extract the month from the tanggal field
            const jadwalMonth = new Date(tanggal).getMonth() + 1;

            // Filter the jadwalharianData based on the selected month
            if (jadwalMonth === selectedMonth) {
              const jumlahPeserta = presensikelasData.filter(
                (presensi) => presensi.nama_kelas === nama_kelas
              ).length;
              const jumlahLibur = status === "Libur" ? 1 : 0;

              const existingData = filteredKelasData.find(
                (data) => data.nama_kelas === nama_kelas
              );
              if (existingData) {
                existingData.jumlahPeserta += jumlahPeserta;
                existingData.jumlahLibur += jumlahLibur;
              } else {
                filteredKelasData.push({
                  nama_kelas,
                  instruktur: nama,
                  jumlahPeserta,
                  jumlahLibur,
                });
              }
            }
          });

          this.jadwalharianData = jadwalharianData;
          this.presensikelasData = presensikelasData;
          this.filteredKelasData = filteredKelasData;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    printTable() {
      // Sort the filteredKelasData array by nama_kelas in ascending order
      this.filteredKelasData.sort((a, b) =>
        a.nama_kelas.localeCompare(b.nama_kelas)
      );

      // Generate the printable content
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
          }
        </style>
      </head>
      <body>
        <h1>GoFit</h1>
        <p>Jl. Centralpark No. 10 Yogyakarta</p>
        <br>
        <h2>LAPORAN AKTIVITAS KELAS BULANAN</h2>
        <p>Bulan: ${this.currentMonth} Tahun: ${this.currentYear}</p>
        <p>Tanggal cetak: ${this.currentDate}</p>
        <br>
        <br>
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
            ${this.filteredKelasData
              .map(
                (kelasData) => `
                  <tr>
                    <td>${kelasData.nama_kelas}</td>
                    <td>${kelasData.instruktur}</td>
                    <td>${kelasData.jumlahPeserta}</td>
                    <td>${kelasData.jumlahLibur}</td>
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
