<template>
    <v-container class="fill-height"
        style="background:  url( 'https://cdn140.picsart.com/247231243024211.png')" fluid>
        <v-row align="center" justify="center" dense>
            <v-col cols="12" sm="8" md="4" lg="4">
                <v-card elevation="12" shaped outlined>
                    <div class="text-center">
                        <h1 class="mb-2 mt-2">Register</h1>
                    </div>

                    <v-img
                        src="https://th.bing.com/th/id/R.4392eff6a3389170ba54878e80dee2dd?rik=Q%2fCkff3SB3ID8w&riu=http%3a%2f%2fwww.megaviewhotel.com%2fupload%2f2011%2fnew%2foutdoor.png&ehk=Kk5%2fOD14jlJICL59MagpPTvSdCKXh0w26eDYxrMnOf0%3d&risl=&pid=ImgRaw&r=0.png"
                        alt="Fedorae Education Log" contain height="200"></v-img>

                    <v-card-text>
                        <v-form @submit.prevent="store" ref="register">
                            <v-text-field v-model="form.name" :error-messages="errors.nameErrors"
                                placeholder="Enter your name" prepend-inner-icon="mdi-account" type="text"
                                class="rounded-0" outlined></v-text-field>



                            <v-text-field v-model="form.email" :error-messages="errors.emailErrors"
                                placeholder="Enter your email" prepend-inner-icon="mdi-email" type="email"
                                class="rounded-0" outlined></v-text-field>
                            <v-text-field v-model="form.password" :error-messages="errors.passwordErrors"
                                placeholder="Enter your password" prepend-inner-icon="mdi-lock" type="password"
                                class="rounded-0" outlined></v-text-field>
                            <v-btn class="rounded-0" color="#000000" type="submit" x-large block dark>Register</v-btn>
                            <v-card-actions class="text--secondary">
                                <v-spacer></v-spacer>
                                <!-- <router-link :to="{ name: 'SignUp' }">Sign Up</router-link> -->
                                Already have an account? <router-link :to="login">Sign Up</router-link>
                                <!-- <a href="#" class="pl-2" style="color: #000000">Sign In</a> -->
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
import { router } from '../router'
import axios from 'axios'


export default {
    name: 'regsiterPage',
    data() {
        return {
            // form: {
            //     name: '',
            //     email: '',
            //     password: '',
            // },
            // emailErrors: 'Tes',
            // namaErrors: 'Tes',
            // passwordErrors: 'Tes'
            login: "/login"
        }
    },
    setup() {
        const form = reactive({
            name: '',
            email: '',
            password: '',
        })

        const validation = ref([])

        // const router = useRouter()

        const errors = reactive({
            nameErrors: '',
            emailErrors: '',
            passwordErrors: '',
        })

        function store() {
            console.log(form.name)
            let name = form.name
            let email = form.email
            let password = form.password
            axios.post('https://tubes-hotel-pw.herokuapp.com/api/register', {
                name: name,
                email: email,
                password: password,

            }).then(() => {
                //redirect ke post index
                console.log("input success");
                // toastr.success('Proyek telah berhasil dibuat');
                router.push('/login')
            }).catch(error => {
                //assign state validation with error
                console.log("validasii")
                validation.value = error.response.data
                console.log(validation.value)
                errors.nameErrors = ''
                errors.emailErrors = ''
                errors.passwordErrors = ''


                // if (validation.value.errors.name[0] ) {
                //     console.log("salah nama")
                //     errors.nameErrors = validation.value.errors.name[0];
                // }
                // if (validation.value.errors.email[0] != 'undefined') {
                //     console.log("salah email")
                //     errors.emailErrors = validation.value.errors.email[0]
                // }
                // if (validation.value.errors.password[0] != 'undefined') {
                //     console.log("salah password")
                //     errors.passwordErrors = validation.value.errors.password[0]
                // }



                if (typeof (validation.value.errors.name) !== 'undefined') {
                    console.log("salah nama")
                    errors.nameErrors = validation.value.errors.name[0];
                }
                if (typeof (validation.value.errors.email) !== 'undefined') {
                    console.log("salah email")
                    errors.emailErrors = validation.value.errors.email[0]
                }
                if (typeof (validation.value.errors.password) !== 'undefined') {
                    console.log("salah password")
                    errors.passwordErrors = validation.value.errors.password[0]
                }

            })
        }

        return {
            form,
            validation,
            errors,
            // router,
            store
        }
    },


}



</script>

<style lang="scss" scoped>

</style>