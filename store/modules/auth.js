import localForage from 'localForage'

export default {
    state: {
        token: null,
        
    },
    getters: {
        
    },
    mutations:{
        setToken(state, token) {
          state.token = token;
        },
    },
    actions: {
        async createUser(vuexContext, data) {
            try {
              const response = await this.$fireAuth.createUserWithEmailAndPassword(
                data.email,
                data.password
              )
              await vuexContext.dispatch('connectRippleApi')
              await vuexContext.dispatch('generateRippleAddress')
              await this.$fireStore.collection("users").doc(response.user.uid).set({
                email: response.user.email,
                uid: response.user.uid,
                photoURL: response.user.photoURL,
                walletAddress: vuexContext.getters.userWalletAddress,
                walletSecret: vuexContext.getters.userWalletSecret
              })
            } catch (err) {
              console.log(err)
            }
    
    
          },
    
          async createUserToFirestore(vuexContext, form) {
            const usersStore = this.$fireStore.collection("users");
            try {
              const docRef = await usersStore.add({
                email: form.email,
                password: form.password
              });
              const doc = await usersStore.doc(docRef.id).get();
              vuexContext.dispatch('createUser', doc.data());
            } catch (err) {
              console.error(err)
            }
    
    
          },

          async signInUser(vuexContext, form) {

            try {
              const response = await this.$fireAuth.signInWithEmailAndPassword(
                form.email,
                form.password
              )
              const token = await response.user.getIdToken()
              vuexContext.commit('setToken', token);
              const doc = await this.$fireStore.collection('users').doc(response.user.uid).get()
              if (doc.exists) {
                // console.log('setting user object')
                // vuexContext.commit('setUserObject', doc.data());
                // vuexContext.commit('setUserWalletAddress', vuexContext.getters.userObject.walletAddress);
                // vuexContext.commit('setUserWalletSecret', vuexContext.getters.userObject.walletSecret);
                // localStorage.setItem('doc', doc);
                // vuexContext.commit('setIsLoggedIn', true)
                // localStorage.setItem('isLoggedIn', vuexContext.state.isLoggedIn)
                vuexContext.dispatch('setUserobjectRef', doc)
                vuexContext.commit('setUserWalletAddress', doc.data().walletAddress);
                vuexContext.commit('setUserWalletSecret', doc.data().walletSecret);
                localForage.setItem('doc', doc.data())
              } else {
                console.log('no doc found')
              }
            } catch (err) {
              error.log(err)
            }
          },
    }
}