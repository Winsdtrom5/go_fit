<template>
    <v-main>
        <h1 class="text font-weight-small mb-35 text-center"><i>Admin Page</i></h1>
        <p class="text-center">Welcome {{ username }}</p>
        <p class="text-center"><i>Fitur Yang Dapat Diakses</i></p>
        <v-item-group>
            <v-container>
                <v-row>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://www.kaorinusantara.or.id/wp-content/uploads/2016/07/kaori-kesan-pertama-new-game-02.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Pegawai </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Pegawai
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Pegawai
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Pegawai
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Pegawai
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Pegawai
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://img.freepik.com/premium-vector/flat-design-coming-soon-promo-background_23-2148880858.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Promo </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Promo
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Promo
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Promo
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Promo
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Promo
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://e1.pxfuel.com/desktop-wallpaper/220/764/desktop-wallpaper-senator-armstrong-unlike-other-villains-isnt-a-steryotipe-but-the-average-american-politician-greedy-evil-apathetic-and-a-piece-of-shit-r-shittygamedetails-senator-armstrong.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Instruktur </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Instruktur
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Instruktur
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Instruktur
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Instruktur
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Instruktur
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