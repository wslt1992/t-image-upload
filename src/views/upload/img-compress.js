/**
 * 压缩
 * @param {base64} fileBase64
 * @param {图片宽} maxLen
 * @param {回调} callBack
 */
export function ImgToBase64 (fileBase64, maxLen, callBack) {
  let img = new Image()
  img.src = fileBase64 // reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
  img.onload = function () {
    // 生成比例
    let width = img.width
    let height = img.height
    // 计算缩放比例
    let rate = 1
    if (width >= height) {
      if (width > maxLen) {
        rate = maxLen / width
      }
    } else {
      if (height > maxLen) {
        rate = maxLen / height
      }
    };
    img.width = width * rate
    img.height = height * rate
    // 生成canvas
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)
    let base64 = canvas.toDataURL('image/jpeg', 0.9)
    callBack(img, base64, canvas)
  }
  //   reader.readAsDataURL(file)
}

/**
 * 将base64转化为Blob对象，可以被放入FormData中
 * @param {*} imgBase64 图片的base64对象
 */
export function base64ToBlob (imgBase64) {
  let base64String = imgBase64

  // 这里对base64串进行操作，去掉url头，并转换为byte
  let bytes = window.atob(base64String.split(',')[1])

  // 处理异常，将ASCII码小于0的转换为大于0，这里有两种写法
  // 第一种：
  // let ab = new ArrayBuffer(bytes.length);
  // let ia = new Uint8Array(ab);
  // for(let i = 0; i < bytes.length; i++){
  //     ia[i] = bytes.charCodeAt(i); //这里有点疑惑，ia是怎么改变ab的？注：①
  // }
  // //Blob对象
  // let blob = new Blob([ab], {type: 'image/jpeg'}); //type为图片的格式

  // //FormData对象
  // let fd = new FormData();
  // //TDOD Ajax或者其他方式上传FormData对象

  // //FormData对象接受三个参数，第三个参数为文件名，通常我们只传前两个参数，第三个参数不传则使用默认文件名，这里使用的Blob对象，所以需要一个文件名，用时间戳代替。
  // fd.append('file',blob, Date.now() + '.jpg');
  // 第二种：
  let array = []
  for (let i = 0; i < bytes.length; i++) {
    array.push(bytes.charCodeAt(i))
  }
  let blob = new Blob([new Uint8Array(array)], {
    type: 'image/jpeg'
  })
  return blob
}
/**
 * 选择图片
 * @param {获取数据的dom} file
 * @param { 需要被选择的图片数据} base64Img
 */
export function rotateImage (file, base64Img) {
  let EXIF = require('exif-js')
  // 图片方向角 added by lzk
  let Orientation = null
  let imgObj = new Image()
  imgObj.src = base64Img

  let canvas = document.createElement('canvas')
  canvas.width = imgObj.width
  canvas.height = imgObj.height

  let promise = new Promise((resolve, reject) => {
    if (base64Img) {
      // 获取照片方向角属性，用户旋转控制
      EXIF.getData(file, function () {
        Orientation = EXIF.getTag(this, 'Orientation')
        // alert('Orientation' + Orientation)
        let base64 = null
        if (Orientation !== '') {
          // alert('旋转处理')
          switch (Orientation) {
            case 1:
              base64 = base64Img
              break
            case 6: // 需要顺时针（向左）90度旋转
              // alert('需要顺时针（向左）90度旋转')
              rotateImg(imgObj, 'left', canvas)
              base64 = canvas.toDataURL('image/jpeg', 1)
              break
            case 8: // 需要逆时针（向右）90度旋转
              // alert('需要顺时针（向右）90度旋转')
              rotateImg(imgObj, 'right', canvas)
              base64 = canvas.toDataURL('image/jpeg', 1)
              break
            case 3: // 需要180度旋转
              // alert('需要180度旋转')
              rotateImg(imgObj, '180', canvas)
              base64 = canvas.toDataURL('image/jpeg', 1)
              break
            default:
              base64 = base64Img
          }
        } else {
          base64 = base64Img
        }
        resolve(base64)
      })
    }
  })
  return promise
}
// 对图片旋转处理 added by lzk
export function rotateImg (img, direction, canvas) {
  // alert(img)
  // 最小与最大旋转方向，图片旋转4次后回到原方向
  let minStep = 0
  let maxStep = 3
  // let img = document.getElementById(pid)
  if (img == null) return
  // img的高度和宽度不能在img元素隐藏后获取，否则会出错
  let height = img.height
  let width = img.width
  let step = 2
  if (step == null) {
    step = minStep
  }
  if (direction === 'right') {
    step++
    // 旋转到原位置，即超过最大值
    step > maxStep && (step = minStep)
  } else if (direction === 'left') {
    step--
    step < minStep && (step = maxStep)
  } else if (direction === '180') {
    step = 2
  }
  // 旋转角度以弧度值为参数
  let degree = step * 90 * Math.PI / 180
  let ctx = canvas.getContext('2d')
  switch (step) {
    case 0:
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0)
      break
    case 1:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, 0, -height)
      break
    case 2:
      canvas.width = width
      canvas.height = height
      ctx.rotate(degree)
      ctx.drawImage(img, -width, -height)
      break
    case 3:
      canvas.width = height
      canvas.height = width
      ctx.rotate(degree)
      ctx.drawImage(img, -width, 0)
      break
  }
}
export function rotateAndCompress (e, compressWidth) {
  let promise = new Promise((resolve, reject) => {
    let imageFile = e.target.files[0]
    if (!e || !window.FileReader) return // 看支持不支持FileReader
    let reader = new FileReader()
    reader.readAsDataURL(imageFile) // 这里是最关键的一步，转换就在这里
    // let _this = this
    reader.onloadend = async function () {
      // 旋转
      let imgNode = document.createElement('img')
      // let imgNode = document.getElementById('exif')W
      imgNode.src = this.result
      imgNode.onload = function () {
        // 选择图片
        let xuanzhuanBase64 = rotateImage(imgNode, this.src)
        xuanzhuanBase64.then(async (xuanzhuanImg) => {
          // 压缩
          let isCompress = fileSize(imageFile, 1 * 1024 * 1024)
          if (isCompress) {
            let compressImage = await imgCompress(xuanzhuanImg, compressWidth)
            // 图片展示
            // _this.previewSrc = compressImage
            console.log('图片被是压缩', compressImage)
            resolve(compressImage)
          } else {
            // 图片展示
            // _this.previewSrc = xuanzhuanBase64
            console.log('图片没有压缩', xuanzhuanImg)
            resolve(xuanzhuanImg)
          }
          // ImgToBase64(res, compressWidth, function (imgObj, compressImage, canvas) {
          //   // 图片展示
          //   // _this.imgUrl = compressImage
          //   console.log('压缩后', compressImage)
          //   promise.resolve(compressImage)
          // })
        })
      }
      // 发送
      // _this.reqFormData = new FormData()
      // let bbbb = base64ToBlob(_this.previewSrc)
      // _this.reqFormData.append('base_image', bbbb)
      // e.srcElement.value = '' // 清空防止上传图片时选择相同文件无法触发change事件

      // callback(_this.previewSrc)
    }
  })
  return promise
}
function imgCompress (imgBase64, compressWidth = 960) {
  let promise = new Promise((resolve, reject) => {
    // 压缩
    // 压缩后图片的宽
    // let compressWidth = 960
    console.log('压缩前', imgBase64)
    // 选择图片压缩
    ImgToBase64(imgBase64, compressWidth, (imgObj, compressImage, canvas) => {
      console.log('压缩后', compressImage)
      resolve(compressImage)
    })
  })
  return promise
}
/**
     * 文件超过fileSizeMax 则，压缩文件
     * @param {*} e Event
     * @param {*} fileSizeMax 文件的最大值
     */
function fileSize (imageFile, fileSizeMax) {
  // var imageFile = e.target.files[0]
  let fileSize = imageFile.size
  if (fileSize >= fileSizeMax) {
    // this.$message({
    //   type: 'error',
    //   message: this.$t('txt_item_249')
    // })
    // e.srcElement.value = '' // 清空防止上传图片时选择相同文件无法触发change事件
    return true
  } else {
    return false
  }
}
