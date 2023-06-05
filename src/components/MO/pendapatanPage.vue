<template>
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
    };
  },
  created() {
    this.fetchIncomeData();
  },
  methods: {
    getTotalFromJanuaryToDecember() {
      let total = 0;
      for (let i = 0; i < this.incomeData.length; i++) {
        const item = this.incomeData[i];
        if (item.Bulan !== "Total") {
          total += parseInt(item.Total.replace(/\./g, "").replace(",", ""));
        }
      }
      return total.toLocaleString();
    },
    fetchIncomeData() {
      const request1 = axios.get(
        "http://10.53.7.170/Server_Go_Fit/public/depositkelas"
      );
      const request2 = axios.get(
        "http://10.53.7.170/Server_Go_Fit/public/deposituang"
      );
      const request3 = axios.get(
        "http://10.53.7.170/Server_Go_Fit/public/aktivasi"
      );

      Promise.all([request1, request2, request3])
        .then(([response1, response2, response3]) => {
          const depositkelasData = response1.data.data;
          const deposituangData = response2.data.data;
          const aktivasidata = response3.data.data;
          const filteredData = [];

          // Iterate through each month (January to December)
          for (let month = 0; month < 12; month++) {
            const filteredDepositkelas = depositkelasData.filter((item) => {
              const itemDate = new Date(item.tanggal);
              return itemDate.getMonth() === month;
            });

            const filteredDeposituang = deposituangData.filter((item) => {
              const itemDate = new Date(item.tanggal);
              return itemDate.getMonth() === month;
            });

            const filteredAktivasi = aktivasidata.filter((item) => {
              const itemDate = new Date(item.tanggal);
              return itemDate.getMonth() === month;
            });

            let totalDeposit = 0;
            let totalAktivasi = 0;

            // Calculate the total deposit from "depositkelas"
            for (const depositkelasItem of filteredDepositkelas) {
              const depositAmount = parseFloat(depositkelasItem.harga);
              totalDeposit += depositAmount;
            }

            // Calculate the total deposit from "deposituang" for the same month
            const filteredDeposituangByMonth = filteredDeposituang.filter(
              (deposituangItem) => {
                const deposituangDate = new Date(deposituangItem.tanggal);
                return (
                  deposituangDate.getMonth() === month &&
                  deposituangDate.getFullYear() === new Date().getFullYear()
                );
              }
            );

            for (const deposituangItem of filteredDeposituangByMonth) {
              const depositAmount = parseFloat(deposituangItem.harga);
              totalDeposit += depositAmount;
            }

            // Sum the "harga" values in "aktivasi" data for the same month
            const filteredAktivasiByMonth = filteredAktivasi.filter(
              (aktivasiItem) => {
                const aktivasiDate = new Date(aktivasiItem.tanggal);
                return (
                  aktivasiDate.getMonth() === month &&
                  aktivasiDate.getFullYear() === new Date().getFullYear()
                );
              }
            );

            for (const aktivasiItem of filteredAktivasiByMonth) {
              const aktivasiAmount = parseFloat(aktivasiItem.harga);
              totalAktivasi += aktivasiAmount;
            }

            // Create the entry for the month
            const monthName = new Date(0, month).toLocaleString("default", {
              month: "long",
            });
            filteredData.push({
              Bulan: monthName,
              Aktivasi: totalAktivasi.toLocaleString(),
              Deposit: totalDeposit.toLocaleString(),
              Total: (totalAktivasi + totalDeposit).toLocaleString(),
            });
          }

          this.incomeData = filteredData;
          this.updateChartData();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    printTable() {
      // Get the current year
      const currentYear = new Date().getFullYear();

      // Format the current date with Indonesian format (tanggal-bulan-tahun)
      const options = { day: "numeric", month: "long", year: "numeric" };
      const currentDate = new Date().toLocaleDateString("id-ID", options);

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
