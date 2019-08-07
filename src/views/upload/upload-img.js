import {
  // ImgToBase64,
  base64ToBlob,
  // rotateImage,
  rotateAndCompress
} from './img-compress.js'
const mixinUploadImg = {
  methods: {
    /**
     * 读取文件并压缩
     * @param {*} e Event
     */
    async readerImg (e) {
      let base64Img = await rotateAndCompress(e)
      // this.previewSrc = base64Img
      // callback(base64Img)
      e.srcElement.value = '' // 清空防止上传图片时选择相同文件无法触发change事件
      // 最后发送数据
      // this.send(base64Img)
      let base64Blob = base64ToBlob(base64Img)
      return {
        base64Img,
        base64Blob
      }
    }
  }
}

export default mixinUploadImg
