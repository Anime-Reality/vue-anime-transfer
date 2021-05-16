<template>
  <v-main>
    <v-container>
      <Webcam :image.sync="img" :upload="upload" :links.sync="urls" />
    </v-container>
    <v-container>
      <center>
        <ShareNetwork
          network="facebook"
          :url="fetchURL"
          title="Do u want to be in anime world? Let's try you can be or not"
          description="https://anime-transfer.netlify.app/"
          quote="Let's transfer your world to anime reality. - Samsan CP"
          hashtags="AnimeTransfer, SamsanTransfer"
        >
          <h2>Share on Facebook</h2>
        </ShareNetwork>
      </center>
    </v-container>
  </v-main>
</template>
<script src="gifshot.js"></script>
<script lang="ts">
import Webcam from '@/views/Webcam.vue'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import Demo from '@/store/modules/demo'
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import FileUploadResponse from '@/types/FileUploadResponse'
// import b64toBlob from '@/utils/b64toblob'
// const DemoModule = getModule(Demo)
@Component({
  components: {
    Webcam,
  },
})
export default class Demo2 extends Vue {
  img = ''
  file = ''
  fetchURL = ''
  urls: string[] = []
  // canDownload = false
  // downloading = false
  // uploading = false
  fileUploaded: FileUploadResponse[] = []
  // fileUploadedDict: { [key: string]: FileUploadResponse } = {}

  transferedImgKey = 0

  Preview_image() {
    console.log(this.file)
    // this.canDownload = false
    this.fetchURL = ''
    if (this.transferedImgKey == 0) {
      this.transferedImgKey = 1
    } else {
      this.transferedImgKey = 0
    }
    // this.urls = URL.createObjectURL(this.file)
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  async upload(index?: string) {
    const DemoModule: Demo = getModule(Demo)
    try {
      const formData = new FormData()
      // this.dataURItoBlob()
      const blob = this.DataURIToBlob(this.img)
      formData.append('file', blob, 'test.jpeg')
      const response: AxiosResponse<FileUploadResponse> = await DemoModule.uploadImage(
        formData,
      )
      if (response.status == 200) {
        // if (index) {
        //   this.fileUploadedDict[index.toString()] = response.data
        // }
        const fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${response.data.filename}`
        // this.urls.push(fetchURL)
        this.download(response.data.filename)
      } else {
        console.error('something wrong')
      }
    } catch (error) {
      console.error(error)
    }
  }

  async download(filename: string) {
    try {
      const response = await axios.get(
        `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`,
      )
      if (response.status == 200) {
        this.fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
        this.urls.push(this.fetchURL)
        // this.canDownload = true
      }
    } catch (error) {
      alert('Download file failed')
    }
    return
  }
}
</script>
