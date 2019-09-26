
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // serverMiddleware:[
  //   {path: '/promise', handler: '~/api/index.js'}
  // ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
 plugins: [{ src: '~/plugins/vuex-persist', ssr: false }],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',


    [
      'nuxt-fire',
      {
        // Required:
        config: {
          development: {
            apiKey: "AIzaSyDOwBbtKgNIvA_WCmPzgfKbBJ8she7jTM0",
            authDomain: "pollnmvp2.firebaseapp.com",
            databaseURL: "https://pollnmvp2.firebaseio.com",
            projectId: "pollnmvp2",
            storageBucket: "pollnmvp2.appspot.com",
            messagingSenderId: "481625019907",
            appId: "1:481625019907:web:39d3197ad0c0b28c"
            },
          production: {
            apiKey: "AIzaSyDOwBbtKgNIvA_WCmPzgfKbBJ8she7jTM0",
            authDomain: "pollnmvp2.firebaseapp.com",
            databaseURL: "https://pollnmvp2.firebaseio.com",
            projectId: "pollnmvp2",
            storageBucket: "pollnmvp2.appspot.com",
            messagingSenderId: "481625019907",
            appId: "1:481625019907:web:39d3197ad0c0b28c"
            }
        },
        // // The following options are optional:
         useOnly: ['auth','firestore','realtimeDb', 'functions'],
        // customEnv: false,
        functionsLocation: 'asia-east2',
      }
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true
  },

  proxy: {
    '/api/': 'https://s.altnet.rippletest.net:51234'
  },

  
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },

  env: {
    rippleTestServer: 'wss://s.altnet.rippletest.net:51233', 
    ripplePublicServer: 'wss://s1.ripple.com',
    rippleJsonApi: "https://api.altnet.rippletest.net:51234"
  }
}
