<template>
  <v-main>
    <v-container>
      <Webcam :image.sync="img" :upload="upload" :links.sync="urls" />
    </v-container>
    <v-container>
      <center>
        <v-btn class="mt-4 mx-10" :href="fetchURL" target="_blank">
          Download
        </v-btn>
        <ShareNetwork
          network="facebook"
          :url="fetchURL"
          title="Do u want to be in anime world? Let's try you can be or not"
          description="https://anime-transfer.netlify.app/demo2"
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
enum RequestStatus {
  Initial = 'initial',
  Loading = 'loading',
  Success = 'success',
  Failure = 'failure',
}

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
  fileUploaded: FileUploadResponse[] = []

  // transferedImgKey = 0

  // Preview_image() {
  //   console.log(this.file)
  //   // this.canDownload = false
  //   this.fetchURL = ''
  //   if (this.transferedImgKey == 0) {
  //     this.transferedImgKey = 1
  //   } else {
  //     this.transferedImgKey = 0
  //   }
  //   // this.urls = URL.createObjectURL(this.file)
  // }

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

  uploadStatus: boolean[] = []
  downloadStatus: boolean[] = []
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
        await this.download(response.data.filename)
      } else {
        console.error('something wrong')
      }
      this.uploadStatus.push(true)
    } catch (error) {
      console.error(error)
      this.uploadStatus.push(false)
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
        this.downloadStatus.push(true)
        // this.canDownload = true
      }
    } catch (error) {
      // alert('Download file failed')
      this.downloadStatus.push(true)
    }
  }
}
</script>
