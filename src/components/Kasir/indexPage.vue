<template>
    <v-main>
        <h1 class="text font-weight-small mb-35 text-center"><i>Kasir Page</i></h1>
        <p class="text-center">Welcome {{ username }}</p>
        <p class="text-center"><i>Fitur Yang Dapat Diakses</i></p>
        <v-item-group>
            <v-container>
                <v-row>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://i1.sndcdn.com/artworks-000201519737-ovt9st-t500x500.jpg"
                        ></v-img>

                         <v-card-title><strong> Mengelola Data Member </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Create Data Member
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Read Data Member
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Update Data Member
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Delete Data Member
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Search Data Member
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://cdn.gamebrott.com/wp-content/uploads/2018/10/LORD_GABEN.jpg"
                        ></v-img>

                         <v-card-title><strong> Pembayaran </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Pembayaran Aktivasi Tahunan
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Pembayaran Deposit Uang
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Pembayaran Deposit Kelas
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
                        <v-img
                            height="250"
                            src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/09/DeathNote.jpg"
                        ></v-img>

                         <v-card-title><strong> Presensi </strong></v-card-title>

                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Presensi Member Gym
                            </div>
                            <div class="my-4 text-subtitle-1">
                                Presensi Member Kelas
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