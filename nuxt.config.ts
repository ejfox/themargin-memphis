import { defineNuxtConfig } from 'nuxt'
import remarkUnwrapImages from 'remark-unwrap-images'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: ['@nuxt/content'],
  css: ['tachyons/css/tachyons.min.css'],
  content: {
    // https://content.nuxtjs.org/api/configuration
    markdown: {
      remarkPlugins: ['remark-unwrap-images']
    },
  },
})
