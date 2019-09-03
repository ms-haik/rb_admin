<template>
  <articleEdit :id="id" />
</template>

<script>
import articleEdit from '@/components/ArticleEdit.vue'
export default {
  name: 'articleedit',
  data () {
    return {
      id: this.$route.params.id
    }
  },
  methods: {
    switchData (id) {
      this.id = id
    }
  },
  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter (to, from, next) {
    const id = to.params.id
    if (id) {
      next(instance => instance.switchData(id))
    } else {
      next(new Error('未指定ID'))
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate (to, from, next) {
    const id = to.params.id
    if (id) {
      this.switchData(id)
      next()
    } else {
      next(new Error('未指定ID'))
    }
  },
  components: {
    articleEdit
  }
}
</script>
