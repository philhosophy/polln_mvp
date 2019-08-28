<template>
<div class="container">
    <div class="form">
        <b-form @submit.prevent="onSubmit">
            <b-form-input class="form-input" id="user-email" v-model="form.email" type="email" required placeholder="Enter email"></b-form-input>
            <b-form-input class="form-input" id="user-password" v-model="form.password" type="password" required placeholder="Enter password"></b-form-input>
            <b-button class="btn btn-success" v-if="formType==='signin'" type="submit">Sign In</b-button>
            <b-button v-if="formType==='signin'" to="/signup">Sign Up</b-button>
            <b-button class="btn btn-success" v-if="formType==='signup'" type="submit">Sign Up</b-button>
            <b-button v-if="formType==='signup'" to="/">Sign In</b-button>
        </b-form>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                formType: this.formType,
                email: '',
                password: '',

            }
        }
    },

    props: {
        formType: String
    },

    methods: {
        onSubmit() {
            console.log(this.form)
            if (this.formType === "signup") {
                this.$store.dispatch('createUser', this.form)
                    .then(
                        this.$router.push('/')
                    );
            } else {
                this.$store.dispatch('signInUser', this.form)
                    .then(() => {
                            this.$router.push('/dashboard');
                            // //i can just spread the current user into firestore state
                            // let obj;
                            // obj = {
                            //     ...this.$fireAuth.currentUser
                            // };
                            // for (let i in obj) {
                            //     console.log(i + obj[i])
                            // }
                        }

                    );
            }

           
        }
    }
}
</script>
