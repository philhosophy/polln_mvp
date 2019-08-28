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

         

      // nuxtServerInit (vuexContext) {
      //   if(!vuexContext.state.user){
      //     console.log("user is null")
      //     console.log(vuexContext.getters.user)
      //   }
      //   else if (vuexContext.state.user) {
      //     console.log('user is not null')
      //     console.log(vuexContext.getters.user)
      //   }
      // }
    }
  })
}
export default createStore;
