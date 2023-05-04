<template>
    <v-container class="fill-height"
        style="background:  url('https://i.pinimg.com/originals/4b/f5/29/4bf5297d2589e3c9f8bb46f131c93400.jpg')" fluid>
        <v-row align="center" justify="center" dense>
            <v-col cols="12" sm="8" md="4" lg="4">
                <v-card elevation="12" shaped outlined>
                    <div class="text-center">
                        <h1 class="mb-2 mt-2">Login Pegawai</h1>
                    </div>

                    <v-img src="https://preview.redd.it/23td86ox29j51.png?auto=webp&s=c617e39e98b1e601cc91168369bd6ea38cd55f89" alt="Chad" contain height="200"></v-img>

                    <v-card-text>
                        <v-form @submit.prevent="store">

                            <v-text-field v-model="form.username" :error-messages="errors.usernameErrors"
                                placeholder="Enter your name" type="username"
                                class="rounded-0" outlined></v-text-field>
                            <v-text-field v-model="form.password" :error-messages="errors.passwordErrors"
                                placeholder="Enter your password" type="password"
                                class="rounded-0" outlined></v-text-field>
                            <!-- <v-btn class="rounded-0" color="#000000" type="submit" x-large block dark href="dashboard">Login</v-btn> -->
                            <v-btn class="rounded-0" color="#000000" type="submit" x-large block dark>Login</v-btn>
                            <v-card-actions class="text--secondary">
                                <v-spacer></v-spacer>
                                <!-- <router-link :to="{ name: 'SignUp' }">Sign Up</router-link> -->
                                <!-- Do not have Account? <router-link :to="register">Sign Up</router-link> -->
                            </v-card-actions>
                        </v-form>
                    </v-card-text>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { reactive, ref } from 'vue'
import { createToastInterface } from "vue-toastification";
import { router } from '../router'
import axios from 'axios'
export default {
    name: 'loginPage',
    data() {
        return {
            register: "/",
            dashboard: "/dashboard",
        }
    },
    mounted() {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, null, window.location.href);
        };
    },
    setup() {
        const form = reactive({
            username: '',
            password: '',
        })

        const validation = ref([])

        const errors = reactive({
            usernameErrors: '',
            passwordErrors: '',
        })

        function store() {
            console.log(form)
            let username = form.username
            let password = form.password
            axios.get('http://10.53.10.52/Server_Go_Fit/public/pegawai/' + username + "/" + password, {})
            .then((response) => {
                if (response && response.data && response.data.data) {
                    let data = response.data.data; // Access 'data' field in response
                    let toast = createToastInterface();
                    toast.success("Selamat Datang "+username, {
                        timeout: 2000
                    });
                    // Check if 'data' is an object
                    let jabatan = data.jabatan;
                    if (jabatan.toLowerCase() === 'admin') {
                        router.push(`/dashboardadmin?username=${username}`);
                    }else if(jabatan.toLowerCase() === 'kasir'){
                        router.push(`/dashboardkasir?username=${username}`);
                    }else{
                        router.push(`/dashboardMO?username=${username}`);
                    }
                }
            }).catch(error => {
                errors.usernameErrors = 'Pegawai not found';
                errors.passwordErrors = 'Pegawai not found';
                console.error(error);
            })
        }

        return {
            form,
            validation,
            errors,
            store
        }
    }
}
</script>

<style lang="scss" scoped>

</style>