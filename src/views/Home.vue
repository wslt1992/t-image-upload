<template>
  <div class="home">
    <base-upload-photo v-model="imgObj"></base-upload-photo>
    <div style="word-wrap:break-word;text-align: left"><span>imgObj:{{imgObj}}</span></div>
  </div>
</template>

<script>
import BaseUploadPhoto from './upload/BaseUploadPhoto'

export default {
  name: 'home',
  data () {
    return {
      imgObj: ''
    }
  },
  methods: {
  },
  components: {
    BaseUploadPhoto
  }
}
</script>
