<template>
  <div>
    <h1>GoFit</h1>
    <p>Jl. Centralpark No. 10 Yogyakarta</p>

    <h2>LAPORAN PENDAPATAN BULANAN</h2>
    <p>PERIODE: 2022</p>
    <p>Tanggal cetak: 20 Desember 2022</p>

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
      </tbody>
    </table>

    <!-- Chart -->
    <!-- Chart -->
    <v-charts :data="chartData"></v-charts>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      incomeData: [],
      chartData: {},
    };
  },
  created() {
    this.fetchIncomeData();
  },
  methods: {
    fetchIncomeData() {
      const request1 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/depositkelas"
      );
      const request2 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/deposituang"
      );
      const request3 = axios.get(
        "http://192.168.1.5/Server_Go_Fit/public/aktivasi"
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
          console.log(this.incomeData);
          this.updateChartData();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    updateChartData() {
      const chartData = {
        labels: [],
        datasets: [
          {
            label: "Total",
            data: [],
          },
        ],
      };

      for (const item of this.incomeData) {
        const bulan = item.Bulan;
        const total = parseFloat(item.Total.replace(/\./g, ""));

        chartData.labels.push(bulan);
        chartData.datasets[0].data.push(total);
      }

      console.log(chartData);

      this.chartData = chartData;
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
</style>
