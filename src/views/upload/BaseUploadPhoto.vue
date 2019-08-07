<template>
  <div class="take-photo">
    <div class="img-ct" v-show="imgUrl" @click="clickTakePhoto">
      <img :src="imgUrl" alt="IMG" >
    </div>
    <div class="take-ct" v-show="!imgUrl">
        <div class="upload-none" @click="clickTakePhoto"></div>
        <div class="upload-photo">
          <!-- <input type="file" ref="file_input" accept="image/*" capture="camera" @change="addFile($event)"/> -->
          <input type="file" ref="file_input" accept="image/*" @change="addFile($event)"/>
          <!-- <input type="file" name="pic" ref="file" accept="image/*" @change="upload"/> -->
        </div>
    </div>
  </div>
</template>

<script>
import mixinUploadImg from './upload-img'
export default {
  mixins: [ mixinUploadImg ],
  data () {
    return {
      imgUrl: null
    }
  },
  props: {
    keys: {
      type: Number
    },
    imgURL: {
      type: String
    }
  },
  watch: {
    imgURL (newVal) {
      this.imgUrl = this.imgURL
    }
  },
  mounted () {
    if (this.imgURL) {
      this.imgUrl = this.imgURL
    }
    let inputFile = document.querySelector('input')
    if (this.getIos()) {
      inputFile.removeAttribute('capture')
    }
  },
  methods: {
    // 清空文件
    setUploadFile () {
      this.imgUrl = null
    },
    clickTakePhoto () {
      // 复用组件里面不要使用id去搜索一个DOM元素
      this.$refs.file_input.click()
    },
    addFile (e) {
      let _this = this
      let result = this.readerImg(e)
      result.then(result => {
        // 图片展示
        _this.imgUrl = result.base64Img
        console.log('压缩后', result.base64Img)
        // 发送
        _this.$emit('input', { imgFile: result.base64Blob, baseURL: _this.imgUrl, keys: _this.keys })
      })
      // 清空防止上传图片时选择相同文件无法触发change事件
      e.srcElement.value = ''
    },
    getIos () {
      var ua = navigator.userAgent.toLowerCase()
      if (ua.match(/iPhone\sOS/i) === 'iphone os') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .take-photo{
  position: relative;
  width: 90px;
  height: 90px;
  .img-ct{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 90px;
    height: 90px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .take-ct{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 90px;
    height: 90px;
    // border: 1px dotted #979797;
    .upload-none{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: url('./take-photo.png') 100% 100%;
      background-size: cover;
      // .take-img{
      //   width: 55px;
      //   height: 54px;
      //   margin: 26px 23px 0 26px;
      // }
      // .take-name{
      //   margin-top: 20px;
      //   font-size: 14px;
      //   color: #979797;
      // }
    }
    .upload-photo{
      display: none;
    }
  }
}
</style>
