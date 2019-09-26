import Vuex from 'vuex';
import authModule from './modules/auth'

import rippleModule from './modules/ripple'
import {vuexfireMutations, firestoreAction} from 'vuexfire'



const createStore = () => {
  return new Vuex.Store({
    modules: {
      authModule,
      rippleModule
    },
    state: {
      user: {}
    },
    getters: {
      user(state){
        return state.user
      },

      userArray(){
        return state.userArray
      }
    },
    mutations: {
      ...vuexfireMutations,
    },

    actions: {
      setUserobjectRef:firestoreAction(
        ({ bindFirestoreRef, unbindFirestoreRef }, { ref }) => {
          // this will unbind any previously bound ref to 'todos'
          console.log('binding ref...')
          bindFirestoreRef('user', ref)
         }),

         

      async nuxtServerInit (vuexContext) {
        // console.log("server code...")
        // const ip = await this.$axios.$post("https://s.altnet.rippletest.net:51234", {
        //         "method": "account_currencies",
        //         "params": [{
        //             "account": "rJ9kLgNCbyW3tAW1TuDyvAyXdr8oKH3VeR",
        //             "account_index": 0,
        //             "ledger_index": "validated",
        //             "strict": true
        //         }]
        //     })
        //     console.log(ip)
      }
    }
  })
}
export default createStore;
