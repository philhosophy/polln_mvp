import rippleTestApi from '~/store/rippleApi.js';

export default {
    state: {
        fundingTransactionObj: {
            senderAddress: 'rwEURtDgUHMab39MmC4szg4HSM5MojTBjk',
            receiverAddress: '',
            sendAmount: '200',
        },
    
        fundingSignObj: {
            txJSON: '',
            senderSecret: 'ssSqcB12Z6fdsjJscGPUPv4hL3SS2'
        },

        userWallet: {
            address:'',
            secret:'',
            xrpBalance:''
        }
    },
    getters: {
        userWalletAddress(state) {
          return state.userWallet.address
        },

        userWalletSecret(state) {
          return state.userWallet.secret
        },

        userWalletXrpBalance(state) {
          return state.userWallet.xrpBalance
        }
    },
    mutations:{
        setUserWalletAddress(state, address) {
            state.userWallet.address = address;
            state.fundingTransactionObj.receiverAddress = address
        },

        setUserWalletSecret(state, secret) {
            state.userWallet.secret = secret;
        },

        setUserWalletXrpBalance(state, balance) {
            state.userWallet.xrpBalance = balance;
        }
    },
    actions: {
        async connectRippleApi(vuexContext) {
            if (!rippleTestApi.isConnected()) {
              try {
                await rippleTestApi.connect()
                console.log("ripple api has connected")
              } catch (err) {
                console.log(err)
              }
            } else {
              console.log("ripple api already connected")
            }
          },
    
          async disconnectRippleApi(vuexContext) {
            if (rippleTestApi.isConnected()) {
              try {
                await rippleTestApi.disconnect()
                console.log("ripple api has disconnected")
              } catch (err) {
                console.log(err)
              }
            } else {
              console.log("ripple api already disconnected")
            }
          },
    
          //creates new ripple testnet accounts but not activated because no funds. can only use xrp testnet faucet to generate already funded accounts
          //fund the wallet here...
          generateRippleAddress(vuexContext) {
            let obj = {
              ...rippleTestApi.generateAddress()
            };
            console.log(obj)
            vuexContext.commit('setUserWalletAddress', obj.address);
            vuexContext.commit('setUserWalletSecret', obj.secret)
            vuexContext.dispatch('fundUserWallet')
          },
    
          async fundUserWallet(vuexContext) {
            try {
              await vuexContext.dispatch('connectRippleApi');
              vuexContext.state.fundingSignObj.txJSON = await vuexContext.dispatch('preparePayment', vuexContext.state.fundingTransactionObj);
              const blob = await vuexContext.dispatch('signPayment', vuexContext.state.fundingSignObj);
              await vuexContext.dispatch('submitPayment', blob);
            } catch (err) {
              console.error("funding" + vuexContext.state.fundingTransactionObj.senderAddress + err);
            }
          },
    
          async setUserWalletXrpBalance(vuexContext) {
            try {
              await vuexContext.dispatch('connectRippleApi');
              console.log('getting balance for user wallet address: ' + vuexContext.getters.userWalletAddress)
              const balance = await rippleTestApi.getAccountInfo(vuexContext.getters.userWalletAddress)
              this.commit('setUserWalletXrpBalance', balance.xrpBalance);
            } catch (err) {
              console.log("set balance" + err)
            }
          },
    
          async preparePayment(vuexContext, obj) {
            const sender = obj.senderAddress
            const preparedTx = await rippleTestApi.prepareTransaction({
              "TransactionType": "Payment",
              "Account": sender,
              "Amount": rippleTestApi.xrpToDrops(obj.sendAmount), // Same as "Amount": "22000000"
              "Destination": obj.receiverAddress
            }, {
              // Expire this transaction if it doesn't execute within ~5 minutes:
              "maxLedgerVersionOffset": 75
            })
            const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
            console.log("Prepared transaction instructions:", preparedTx.txJSON)
            console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
            console.log("Transaction expires after ledger:", maxLedgerVersion)
            return preparedTx.txJSON
          },
    
          signPayment(vuexContext, signObj) {
            const response = rippleTestApi.sign(signObj.txJSON, signObj.senderSecret)
            const txID = response.id
            console.log("Identifying hash:", txID)
            const txBlob = response.signedTransaction
            console.log("Signed blob:", txBlob)
    
            return txBlob;
          },
    
          async submitPayment(vuexContext, txBlob) {
            const latestLedgerVersion = await rippleTestApi.getLedgerVersion()
    
            const result = await rippleTestApi.submit(txBlob)
    
            console.log("Tentative result code:", result.resultCode)
            console.log("Tentative result message:", result.resultMessage)
    
            // Return the earliest ledger index this transaction could appear in
            // as a result of this submission, which is the first one after the
            // validated ledger at time of submission.
            return result.resultCode;
          },
    
          async getPaymentChannel(vuexContext, channelId){
            try {
              await vuexContext.dispatch('connectRippleApi');
              const channel = await rippleTestApi.getPaymentChannel(channelId);
              return channel
            }
            catch(err) {
              console.error(err)
            }
          },
    
          async subscribeToAccount(vuexContext, address) {
            try {
              await vuexContext.dispatch('connectRippleApi');
              rippleTestApi.connection.on('transaction', (ev) => {
                console.log(JSON.stringify(ev, null, 2))
                vuexContext.dispatch('setUserWalletXrpBalance', address)
              })
              const response = await rippleTestApi.request('subscribe', {
                accounts: [address]
              })
              if (response.status === 'success') {
                console.log('Successfully subscribed')
              }
              return response
            } catch (err) {
              console.error("suscribe" + err)
            }
        },
    }
}