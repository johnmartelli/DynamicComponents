# VueApp5

This is a sample that builds a normal Vue 3/Vite app that dynamically loads components into HTML tags based 
on a map in the main.js file. This allows run time dynamic creation of the Vue JS component in the browser. 
The library is built with vite which means there are all the benefits, including a proper proecvt structure 
that allows Vue single file components (SFC) to be used.

Both PimrVue and SyncFusion are included. Please note that there is a lot of code in Calendar.vue: I am working on 
reading our APIs into a SyncFusion DataManager using a CustomDataAdaptor. This has proven to be far from easy

To test, use the vanilla.html file that you can copy to the dist folder. Make sure you update the hashed cache busting
include <script type="module" crossorigin src="/assets/index-JMabCIMp.js"></script> with the correctly hased version

This project also uses:

**https**
npm install -g mkcert
mkcert create-ca --organization "Local development CA" --validity 3650
mkcert create-cert --ca-key .\ca.key --ca-cert .\ca.crt --validity 3650 --organization "Local development"
in vite.config.js:

```
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    }
  }
```

**proxy for API calls**
in vite.config.js:
```
server: {
    proxy: {
      // Proxying API requests
      '/api': {
        target: 'https://platform.altamirahrm.com', // The backend server you're proxying to
        changeOrigin: true, // Needed for virtual hosted sites
        //rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path; remove /api
      },
      // You can add other proxies here if needed
    }
}
```