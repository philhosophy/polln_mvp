<template>
    <div>
        <h1>Transfer</h1>
        <!-- <wallet walletType="Funding Wallet" :walletAddress="user.walletAddress" :walletSecret="user.walletSecret"></wallet> -->
        <hr>
        <!-- can just give this the whole user -->
        <wallet walletType="User Wallet" :walletAddress="user.walletAddress" :walletSecret="user.walletSecret"></wallet>
        
    </div>
</template>

<script>
import Wallet from '~/components/UI/Wallet'
import {mapState, mapGetters} from 'vuex'

export default {
    components:{
        Wallet
    },
    
    
    
    computed:{
        ...mapGetters(["user"])
    }
}
</script>
