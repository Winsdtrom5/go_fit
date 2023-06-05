<template>
  <div>
    <h1>GoFit</h1>
    <p>Jl. Centralpark No. 10 Yogyakarta</p>

    <h2>LAPORAN AKTIVITAS GYM BULANAN</h2>
    <p>Bulan: {{ currentMonth }} Tahun: {{ currentYear }}</p>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Jumlah Member</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(gymData, index) in filteredgymData.sort(
            (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
          )"
          :key="index"
        >
          <template
            v-if="
              index === 0 ||
              gymData.nama_kelas !== filteredgymData[index - 1].nama_kelas
            "
          >
            <td>{{ formatDate(gymData.tanggal) }}</td>
            <td>{{ gymData.jumlahMember }}</td>
          </template>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td>{{ calculateTotal() }}</td>
        </tr>
      </tbody>
    </table>
    <div class="button-section">
      <v-btn color="brown" dark @click="printTable">Print</v-btn>
      <!-- <v-btn color="brown" class="secondary-btn" dark @click="savePDF"
          >Save As PDf</v-btn
        > -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
export default {
  data() {
    return {
      jadwalharianData: [],
      presensigymData: [],
      filteredgymData: [],
      currentDate: "",
      currentMonth: "",
      currentYear: "",
    };
  },
  mounted() {
    this.fetchData();
    this.currentDate = this.getCurrentDate();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
  },
  methods: {
    calculateTotal() {
      return this.filteredgymData.reduce((total, gymData) => {
        return total + gymData.jumlahMember;
      }, 0);
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
    getCurrentMonth() {
      const date = new Date();
      const options = {
        month: "long",
      };
      return date.toLocaleDateString("id-ID", options);
    },
    getCurrentYear() {
      const date = new Date();
      return date.getFullYear();
    },
    fetchData() {
      const request = axios.get(
        "http://10.53.7.170/Server_Go_Fit/public/presensigym"
      );

      request
        .then((response) => {
          const presensigymData = response.data.data;
          const filteredgymData = [];

          presensigymData.forEach((data) => {
            const { tanggal } = data;
            const jumlahMember = presensigymData.filter(
              (item) => item.tanggal === tanggal
            ).length;

            const existingData = filteredgymData.find(
              (item) => item.tanggal === tanggal
            );
            if (existingData) {
              existingData.jumlahMember += jumlahMember;
            } else {
              filteredgymData.push({
                tanggal,
                jumlahMember,
              });
            }
          });

          this.presensigymData = presensigymData;
          this.filteredgymData = filteredgymData;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    formatDate(date) {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Date(date).toLocaleDateString("id-ID", options);
    },
    savePDF() {
      const pdf = new jsPDF({
        orientation: "landscape",
      });

      const fontSize = 12; // Adjust the font size as needed
      const lineHeight = fontSize * 1.2; // Adjust the line height as needed

      // Set the vertical position of the content
      let y = 20;

      pdf.setFontSize(fontSize);
      pdf.text("GoFit", 20, y);
      y += lineHeight;

      pdf.setFontSize(fontSize);
      pdf.text("Jl. Centralpark No. 10 Yogyakarta", 20, y);
      y += lineHeight * 2;

      pdf.setFontSize(fontSize + 2);
      pdf.text("LAPORAN AKTIVITAS GYM BULANAN", 20, y);
      y += lineHeight;

      pdf.setFontSize(fontSize);
      pdf.text(`Bulan: ${this.currentMonth} Tahun: ${this.currentYear}`, 20, y);
      y += lineHeight;

      pdf.setFontSize(fontSize);
      pdf.text(`Tanggal cetak: ${this.currentDate}`, 20, y);
      y += lineHeight * 2;

      // Add table headers
      // Draw table headers
      pdf.setFontSize(fontSize);
      pdf.text("Kelas", 20, y);
      pdf.text("Instruktur", 60, y);
      pdf.text("Jumlah Peserta", 100, y);
      pdf.text("Jumlah libur", 140, y);
      y += lineHeight; // Increase the vertical position for the next row

      // Draw table header horizontal line
      pdf.setLineWidth(0.5); // Set the line width
      pdf.line(20, y, 190, y); // Draw a line under the table headers
      y += lineHeight; // Increase the vertical position for the next row

      // Iterate through the filteredgymData array to add table rows
      this.filteredgymData.forEach((gymData, index) => {
        // Check if it's the first row or the current row has a different nama_kelas
        if (
          index === 0 ||
          gymData.nama_kelas !== this.filteredgymData[index - 1].nama_kelas
        ) {
          // Draw table row horizontal line
          pdf.line(20, y, 190, y);

          // Add data in table cells
          pdf.setFontSize(fontSize);
          pdf.text(gymData.nama_kelas, 25, y - 3);
          pdf.text(gymData.instruktur, 65, y - 3);
          pdf.text(gymData.jumlahMember.toString(), 105, y - 3);
          pdf.text(gymData.jumlahLibur.toString(), 145, y - 3);

          y += lineHeight; // Increase the vertical position for the next row
        }
      });

      // Draw table bottom horizontal line
      pdf.line(20, y, 190, y);

      // Print the PDF document
      pdf.autoPrint();

      // Save the PDF document to a file
      pdf.save(
        `laporan kelas bulan ${this.currentMonth} tahun ${this.currentYear}.pdf`
      );
    },
    printTable() {
      // Sort the filteredgymData array by nama_kelas in ascending order
      this.filteredgymData.sort(
        (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
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
            .total-row {
              font-weight: bold;
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
              <th>Tanggal</th>
              <th>Jumlah Member</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredgymData
              .map(
                (gymData, index) => `
                  <tr>
                    <td>${this.formatDate(gymData.tanggal)}</td>
                    <td>${gymData.jumlahMember}</td>
                  </tr>
                  ${
                    index === this.filteredgymData.length - 1
                      ? `
                  <tr class="total-row">
                    <td><strong>Total</strong></td>
                    <td>${this.calculateTotal()}</td>
                  </tr>
                  `
                      : ""
                  }
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
