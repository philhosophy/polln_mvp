<template>
<div>
    <p>Wallet Type: {{walletType}}</p>
    <p>Wallet Address: {{walletAddress}}</p>
    <p>Wallet Balance: {{userWalletXrpBalance}}</p>
    <form>
        <div class="form-row">
            <div class="col">
                <input type="text" class="form-control" placeholder="Receiving Address" v-model="transactionObj.receiverAddress">
            </div>
            <div class="col">
                <input type="text" class="form-control" placeholder="Amount in XRP" v-model="transactionObj.sendAmount">
            </div>
        </div>
        <b-button class="btn btn-success" @click="onSend">send</b-button>
    </form>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';

export default {
    data() {
        return {
            transactionObj: {
                senderAddress: this.walletAddress,
                receiverAddress: '',
                sendAmount: '0',

            },

            signObj: {
                txJSON: '',
                senderSecret: this.walletSecret
            },
        }
    },
    computed: {

        ...mapGetters(['user', 'userWalletXrpBalance']),
       

    },

    created() {
        this.setBalance();
        this.$store.dispatch('subscribeToAccount', this.walletAddress)
    },

    props: {
        walletType: '',
        walletAddress: '',
        walletSecret: ''
    },

    
    methods: {
        async onSend(){
            try {
                await this.$store.dispatch('connectRippleApi');
                this.signObj.txJSON = await this.$store.dispatch('preparePayment', this.transactionObj);
                const blob = await this.$store.dispatch('signPayment', this.signObj);
                await this.$store.dispatch('submitPayment', blob);
            }
            catch(err) {
                console.error(err);
            }
        },
        async setBalance() {
            const balance = await this.$store.dispatch('setUserWalletXrpBalance');
        },

    }

}
</script>
