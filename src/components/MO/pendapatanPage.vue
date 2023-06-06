<template>
  <div>
    <h1>GoFit</h1>
    <p>Jl. Centralpark No. 10 Yogyakarta</p>
    <h2 class="section-title">Laporan Pendapatan Tahunan</h2>
    <v-autocomplete
      v-model="selectedYear"
      :items="years"
      label="Select Year"
      outlined
    ></v-autocomplete>
    <v-btn v-if="selectedYear" @click="showDialog" color="brown" dark class="mt-4"> Preview </v-btn>
    <v-dialog v-model="dialogVisible">
      <v-card>
        <div>
          <h1>GoFit</h1>
          <p>Jl. Centralpark No. 10 Yogyakarta</p>

          <h2>LAPORAN PENDAPATAN BULANAN</h2>
          <p>PERIODE: {{ currentYear }}</p>

          <!-- Table -->
          <table>
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Aktivasi</th>
                <th>Deposit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in incomeData" :key="item.bulan">
                <td>{{ item.Bulan }}</td>
                <td>{{ item.Aktivasi }}</td>
                <td>{{ item.Deposit }}</td>
                <td>{{ item.Total }}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right">Total</td>
                <td v-if="incomeData.length">
                  {{ getTotalFromJanuaryToDecember() }}
                </td>
                <td v-else>-</td>
              </tr>
            </tbody>
          </table>

          <!-- Chart -->
          <v-chart :data="chartData"></v-chart>
          <!-- Button to print the table -->
          <v-btn color="brown" dark @click="printTable"> Print </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import VChart from "v-charts";
export default {
  data() {
    return {
      incomeData: [],
      chartData: {},
      currentYear: new Date().getFullYear(),
      currentDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      years: [],
      selectedYear: "",
      dialogVisible: false,
    };
  },
  created() {
    this.fetchAvailableYears();
  },
  methods: {
    fetchAvailableYears() {
      const request1 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/deposituang"
      );
      const request2 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/depositkelas"
      );
      const request3 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/aktivasi"
      );

      Promise.all([request1, request2, request3])
        .then(([response1, response2, response3]) => {
          const data1 = response1.data.data;
          const data2 = response2.data.data;
          const data3 = response3.data.data;

          const years1 = data1.map((item) =>
            new Date(item.tanggal).getFullYear()
          );
          const years2 = data2.map((item) =>
            new Date(item.tanggal).getFullYear()
          );
          const years3 = data3.map((item) =>
            new Date(item.tanggal).getFullYear()
          );

          const allYears = [...years1, ...years2, ...years3];
          this.years = [...new Set(allYears)]; // Remove duplicates and assign to years array
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    showDialog() {
      this.dialogVisible = true;
      this.fetchIncomeData(this.selectedYear);
    },
    getTotalFromJanuaryToDecember() {
      let total = 0;
      for (let i = 0; i < this.incomeData.length; i++) {
        const item = this.incomeData[i];
        if (item.Bulan !== "Total") {
          const itemTotal =
            typeof item.Total === "string"
              ? item.Total.replace(/\./g, "").replace(",", "")
              : item.Total;
          total += parseInt(itemTotal);
        }
      }
      return total.toLocaleString();
    },

    fetchIncomeData(year) {
      const request1 = axios.get(
        `http://192.168.1.5/Server_Go_Fit/public/pendapatan/${year}`
      );

      Promise.all([request1])
        .then(([response1]) => {
          console.log(response1.data.data);
          const pendapatan = response1.data.data;
          const filteredData = pendapatan.map((item) => ({
            Bulan: item.Bulan,
            Aktivasi: item.Aktivasi,
            Deposit: item.Deposit,
            Total: item.Total,
          }));

          this.incomeData = filteredData;
          this.updateChartData();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    printTable() {
      // Get the current year
      // Get the current year
      const currentYear = new Date().getFullYear();

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
            <h2>LAPORAN PENDAPATAN BULANAN</h2>
            <br>
            <p>PERIODE: ${currentYear}</p>
            <p>Tanggal cetak: ${currentDate}</p>
            <br>
            <br>
            <table>
              <thead>
                <tr>
                  <th>Bulan</th>
                  <th>Aktivasi</th>
                  <th>Deposit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${this.incomeData
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.Bulan}</td>
                        <td>${item.Aktivasi}</td>
                        <td>${item.Deposit}</td>
                        <td>${item.Total}</td>
                      </tr>
                    `
                  )
                  .join("")}
                <tr>
                  <td colspan="3" class="right-align">Total</td>
                  <td class="right-align" v-if="incomeData.length">
                    ${this.getTotalFromJanuaryToDecember()}
                  </td>
                </tr>
              </tbody>
            </table>
            <br>
          <br>
          ${chartContainer.outerHTML}
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
    updateChartData() {
      const chartData = {
        columns: ["Bulan", "Total"],
        rows: [],
      };

      for (const item of this.incomeData) {
        const bulan = item.Bulan;
        const total = parseFloat(item.Total.replace(/\./g, ""));
        chartData.rows.push({ Bulan: bulan, Total: total });
      }

      this.chartData = chartData;
    },
  },
  components: {
    VChart,
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
</style>
