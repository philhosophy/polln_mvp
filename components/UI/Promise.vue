<template>
<div>
    <p>User wallet: {{walletAddress}}</p>
    <p>available balance: {{userWalletXrpBalance}}</p>
    <form>
        <div class="form-row">
            <div class="col">
                <input type="text" class="form-control" placeholder="Receiving Address" v-model="paymentChannel.destination">
            </div>
            <div class="col">
                <input type="text" class="form-control" placeholder="Amount in XRP" v-model="paymentChannel.amount">
            </div>
        </div>
        <b-button class="btn btn-success" @click="onCreatePaymentChannel">create payment channel</b-button>
    </form>
    <div class="col">
        <input type="text" placeholder="channel id" v-model="channelId">
        <b-button class="btn btn-success" @click="getChannelInfo">get payment channel info</b-button>

    </div>
    <div>
        <input type="text" placeholder="payee address" v-model="accountChannels.payeeAddress">
        <b-button class="btn btn-success" @click="getAccountChannels">get account channels</b-button>
    </div>
    <div class="col">
        <input type="text" class="form-control" placeholder="Channel to sign claim for" v-model="signClaim.channelId">
        <input type="number" class="form-control" placeholder="Amount to authorize" v-model="signClaim.amount">
        <input type="text" class="form-control" placeholder="Private key to sign claim" v-model="signClaim.privateKey">
        <b-button class="btn btn-success" @click="signChannelClaim">sign claim</b-button>
    </div>
    <div class="col">
        <input type="text" class="form-control" placeholder="Channel to verify" v-model="verifyClaim.channelId">
        <input type="number" class="form-control" placeholder="Amount to verify" v-model="verifyClaim.amount">
        <input type="text" class="form-control" placeholder="signature to verify" v-model="verifyClaim.signature">
        <input type="text" class="form-control" placeholder="public key of sender to verify" v-model="verifyClaim.publicKey">
        <b-button class="btn btn-success" @click="verifyChannelClaim">verify claim</b-button>
    </div>
    <div>
 <input type="text" class="form-control" placeholder="account id" v-model="claimJSON.Account">
                <input type="text" class="form-control" placeholder="channel id" v-model="claimJSON.Channel">
        <input type="text" class="form-control" placeholder="balance" v-model="claimJSON.Balance">
        <input type="text" class="form-control" placeholder="amount to redeem" v-model="claimJSON.Amount">
        <input type="text" class="form-control" placeholder="signature" v-model="claimJSON.Signature">
        <input type="text" class="form-control" placeholder="public key" v-model="claimJSON.PublicKey">

        <b-button class="btn btn-success" @click="redeemClaim">redeem claim</b-button>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import rippleGen from 'ripple-keypairs';
import rippleTestApi from '~/store/rippleApi.js';

export default {

    data() {
        return {
            paymentChannel: {
                amount: "",
                destination: "",
                settleDelay: 86400,
                publicKey: ""
            },

            signObj: {
                txJSON: '',
                senderSecret: ''
            },

            keyPair: null,
            channelId: '',
            signClaim: {
                channelId: '',
                amount: '',
                privateKey: ''
            },
            verifyClaim: {
                channelId: '',
                amount: '',
                signature: '',
                publicKey: ''
            },
            accountChannels: {
                payeeAddress: ''
            },

            claimJSON: {
                "TransactionType": "PaymentChannelClaim",
                "Account": "",
                "Channel": "",
                "Balance": "",
                "Amount": "",
                "Signature": "",
                "PublicKey": ""
            }
        }
    },

    props: {
        walletAddress: ''
    },

    computed: {
        ...mapGetters(["user", "userWalletXrpBalance", "userWalletSecret"]),

    },

    created() {
        this.$store.dispatch('setUserWalletXrpBalance');
        this.$store.dispatch('subscribeToAccount', this.walletAddress);
        this.claimJSON.Account = this.walletAddress;
    },

    methods: {
        async onCreatePaymentChannel() {
            try {
                await this.$store.dispatch("connectRippleApi");
                while (!this.keyPair) {
                    const seed = rippleGen.generateSeed();
                    console.log(seed);
                    this.keyPair = this.genKey(seed)
                }
                this.paymentChannel.publicKey = this.keyPair.publicKey;
                this.claimJSON.PublicKey = this.keyPair.publicKey;
                console.log("public key: " + this.paymentChannel.publicKey + " private key: " + this.keyPair.privateKey);
                this.signClaim.privateKey = this.keyPair.privateKey;
                this.verifyClaim.publicKey = this.keyPair.publicKey;
                const channelRes = await rippleTestApi.preparePaymentChannelCreate(this.user.walletAddress, this.paymentChannel);
                console.log(JSON.parse(channelRes.txJSON).PublicKey)
                this.signObj.txJSON = channelRes.txJSON;
                this.signObj.senderSecret = this.user.walletSecret;
                console.log('json' + this.signObj.txJSON)
                const blob = await this.$store.dispatch('signPayment', this.signObj);
                await this.$store.dispatch('submitPayment', blob);
            } catch (err) {
                console.error(err)
            }
        },

        async redeemClaim() {
            try {
                const signRes = await rippleTestApi.prepareTransaction(this.claimJSON);
                console.log(signRes.txJSON);
                const txBlob = await rippleTestApi.sign(signRes.txJSON, this.user.walletSecret);
                console.log(txBlob.id);
                //transaction not found
                const get = await rippleTestApi.getTransaction(txBlob.id);
                console.log(get);
                const subRes = await rippleTestApi.submit(txBlob.signedTransaction);
                console.log(subRes);
            }
            catch(err){
                console.log(err)
            }
        },

        async signChannelClaim() {
            try {
                const res = await rippleTestApi.signPaymentChannelClaim(this.signClaim.channelId, this.signClaim.amount, this.signClaim.privateKey);
                console.log(res)
                this.verifyClaim.signature = res;
                this.claimJSON.Signature = res;
            } catch (err) {
                console.error(err)
            }
        },

        async verifyChannelClaim() {
            //use public key hex of channel
            try {
                const res = await rippleTestApi.verifyPaymentChannelClaim(this.verifyClaim.channelId, this.verifyClaim.amount, this.verifyClaim.signature, this.verifyClaim.publicKey);
                console.log(res)
            } catch (err) {
                console.error(err)
            }
        },

        async getChannelInfo() {
            try {
                const channelInfo = await rippleTestApi.getPaymentChannel(this.channelId);
                console.log('getting channel info...');
                console.log(channelInfo);
            } catch (err) {
                console.error(err)
            }
        },

        async getAccountChannels() {
            try {
                const res = await rippleTestApi.request('account_channels', {
                    "account": this.walletAddress
                })
                console.log(res.channels[0])
                let channel = res.channels[0]
                this.signClaim.channelId = channel.channel_id;
                this.verifyClaim.channelId = channel.channel_id;
                this.claimJSON.Channel = channel.channel_id;
            } catch (err) {
                console.error(err)
            }
        },

        genKey(seed) {
            try {
                return rippleTestApi.deriveKeypair(seed)
            } catch (err) {

            }
        },

        async createWallet() {
            try {
                const res = await rippleTestApi.request('wallet_propose');
                console.log(res)
            } catch (err) {
                console.log(err)
            }
        }

    }

}
</script>
