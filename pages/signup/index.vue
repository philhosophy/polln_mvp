<template>
<div class="container">
    <user-auth-form formType="signup"></user-auth-form>

</div>
</template>

<script>
import userAuthForm from '~/components/Auth/UserAuthForm'
export default {
    components:{
        userAuthForm
    },
    data() {
        return {
            form: {
                isLogin: false,
                email: '',
                password: '',

            }
        }
    },

    methods: {
        //assign new ripple key upon sign up success
        
    }
}
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}

.form-input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    font: inherit;
    border: 1px solid #ccc;
    padding: 5px;
    margin: 5px
}
</style>
