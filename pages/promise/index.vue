<template>
<div>
    <promise :walletAddress=user.walletAddress></promise>
    <hr>

</div>
</template>

<script>
import Promise from '~/components/UI/Promise'
import {
    mapGetters
} from 'vuex'
export default {
    // async asyncData(context) {
    //     if (process.server) {
    //         console.log("server code...")
    //         const ip = await context.app.$axios.$post("https://s.altnet.rippletest.net:51234", {
    //             "method": "account_currencies",
    //             "params": [{
    //                 "account": "rJ9kLgNCbyW3tAW1TuDyvAyXdr8oKH3VeR",
    //                 "account_index": 0,
    //                 "ledger_index": "validated",
    //                 "strict": true
    //             }]
    //         })
    //         console.log(ip)
    //     }
    // },

    components: {
        Promise
    },

    computed: {
        ...mapGetters(['user'])
    }
}
</script>
