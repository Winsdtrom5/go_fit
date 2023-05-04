<template>
    <v-main>
        <h1 class="text font-weight-small mb-35 text-center"><i>Manajer Operasional Page</i></h1>
        <p class="text-center">Welcome {{ username }}</p>
        <p class="text-center"><i>Fitur Yang Dapat Diakses</i></p>
        <v-item-group>
            <v-container>
                <v-row>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://i.ytimg.com/vi/OuvOUhHpXbs/maxresdefault.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Kelas </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Kelas
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Kelas
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Kelas
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Kelas
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Kelas
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://content.wepik.com/statics/10349481/preview-page0.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Jadwal Umum </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Jadwal Umum
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Jadwal Umum
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Jadwal Umum
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Jadwal Umum
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://www.timecamp.com/blog/wp-content/uploads/2020/02/calendarpedia-template.png"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Jadwal Harian </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Read Data Jadwal Harian
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Jadwal Harian
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Jadwal Harian
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/red-dead-redemption-2/8/86/Uncle.jpg"
                        ></v-img>

                         <v-card-title><strong>Ijin Instruktur </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Show Daftar Ijin Instruktur
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Konfirmasi Ijin Instruktur
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,q_auto:best,w_640/v1614598177/kmzu8wqt2zjozirarix3.jpg"
                        ></v-img>

                         <v-card-title><strong>Menampilkan Laporan </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Menampilkan laporan pendapatan per bulan dalam tahun tertentu (tabel dan grafik)
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Menampilkan Laporan aktivitas Kelas bulanan
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Menampilkan Laporan Aktivitas Gym bulanan
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Menampilkan Laporan kinerja instruktur bulanan
                            </div>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-item-group>
    </v-main>
</template>
<style>
.text {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
<script>
    export default {
        props: {
        username: {
            type: String,
            required: true
        }
    },
        data: () => ({
            loading: false,
            selection: 1,
        }),
    };
</script>