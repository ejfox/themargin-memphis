import visit from 'unist-util-visit'

export default defineNuxtPlugin((nuxtApp) => {
  return function transformer(tree, file) {
    visit(tree, 'element', visitor)
    function visitor(node) {
      if (node.tagName === 'img') {
        node.tagName = 'post-image'
      }
    }
  }
})
