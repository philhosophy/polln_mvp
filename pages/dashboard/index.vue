<template>
<div>
    
    <b-container class="bv-example-row">
        <b-img thumbnail center :src="user.photoURL" fluid rounded="circle" alt="center image"></b-img>
        
        <b-row>
            <b-col>Column</b-col>
            <vue-inline-text-editor :placeholder="user.email" close-on-blur hover-effects :value.sync="email" type="text" @blur="onBlur" @close="onClose" @change="onChange" @open="onOpen" @update="onUpdate('email', email)">
            </vue-inline-text-editor>
            <div class="w-100"></div>
            <b-col>Column</b-col>
            <vue-inline-text-editor :placeholder="user.photoURL" close-on-blur hover-effects :value.sync="photoURL" type="text" @blur="onBlur" @close="onClose" @change="onChange" @open="onOpen" @update="onUpdate('photoURL', photoURL)">
            </vue-inline-text-editor>
        </b-row>
        <b-button class="btn btn-primary" to="/dashboard/transfer">Transfer</b-button>
        <b-button class="btn btn-primary" to="/promise">My Promise</b-button>
        <b-button class="btn btn-primary" @click="getWalletInfo">Get wallet account info</b-button>
    </b-container>
</div>

</template>

<script>
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex'
import VueInlineTextEditor from 'vue-inline-text-editor';
import localForage from 'localForage';

export default {
    components: {
        VueInlineTextEditor
    },

    // async created(){
    //     const doc = await this.$fireStore.collection('users').doc(this.userObject.uid).get();
    //     this.$store.dispatch('setUserobjectRef', doc)
    // },

    created(){
        
        
    
    },

    data() {
        return {
            email: '',
            photoURL: '',
            yay: '',
            displayName: ''
        }
    },

    // middleware: 'getUser',

    computed: {
        ...mapGetters(['user'])
      

    },

    

    methods: {
        changeEmail() {
            this.$fireStore.collection('users').doc(this.user.uid).update({
                email: this.email
            })
        },
        onBlur: function () {
            console.log('text blur:');
        },
        onClose: function () {
            console.log('text close:');
        },
        onChange: function () {
            console.log('text changed:')
        },
        onOpen: function () {
            console.log('text open:');
        },
        onUpdate: function (propname, prop) {
            let obj = {};
            obj[propname] = prop
            console.log(obj)
            this.$fireStore.collection('users').doc(this.user.uid).update(obj)
        },

        getWalletInfo(){
            alert("hi")
        }

    }

}
</script>
