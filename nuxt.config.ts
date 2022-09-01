import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: ['@nuxt/content'],
  css: ['tachyons/css/tachyons.min.css'],
  content: {
    // https://content.nuxtjs.org/api/configuration
    markdown: {
      remarkPlugins: ['remark-unwrap-images'],
    },
  },
  vite: {
    define: {
      'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
      'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000',
    },
  },
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.6.2/animate.min.css',
      }      
    ],
    script: [
      {
        src: 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js',
      }
    ]

  },
})
