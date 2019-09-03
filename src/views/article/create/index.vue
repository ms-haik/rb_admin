<template>
  <articleEdit :id="id" />
</template>

<script>
import articleEdit from '@/components/ArticleEdit.vue'
export default {
  name: 'articlecreate',
  data () {
    return {
      id: 0
    }
  },
  components: {
    articleEdit
  }
}
</script>
