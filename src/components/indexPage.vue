<template>
    <v-main>
        <h1 class="text font-weight-small mb-35 text-center"><i>Selamat Datang di Hotel GAWO</i></h1>
        <p class="text-center"><i>Gambaran Singkat Mengenai Hotel Gawo</i></p>
        <v-item-group>
            <v-container>
                <v-row>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://www.meliahotelsinternational.com/en/PublishingImages/historico/2157/07cMeliaDeMar-SwimmingPool_0.jpg"
                        ></v-img>

                         <v-card-title><strong> GAWO Hotel </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Hotel Gawo, salah satu hotel terbaik di kota Konoha 
                                yang dekat dengan pusat kota dan tempat berbelanja. Didukung dengan 
                                tempat spa lengkap, kolam renang serta kamar super keren akan 
                                membuat liburan Anda semakin menyenangkan.
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://th.bing.com/th/id/OIP.kRLC5eApwgS0PpAdg9G6zgHaE0?pid=ImgDet&rs=1.jpeg"
                        ></v-img>

                         <v-card-title><strong> Kamar Eksklusif </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Hotel Gawo memberikan bermacam fasilitas penginapan yang dapat 
                                anda nikmati dengan standar bintang 5 yang akan memberikan anda
                                sensasi beristirahat dengan nyaman dan baik.
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://watermark.lovepik.com/photo/20211130/large/lovepik-hotel-restaurant-waiter-order-picture_501203542.jpg"
                        ></v-img>

                         <v-card-title><strong> Pelayanan Kami </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Pelayan Hotel Gawo dijamin memberikan pengalaman tersendiri
                                bagi anda, Pelayanan yang lengkap dan dapat sesuai dengan
                                apa yang anda ingin ada di Hotel Gawo.
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
        data: () => ({
            loading: false,
            selection: 1,
        }),
    };
</script>