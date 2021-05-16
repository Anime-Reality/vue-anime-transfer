<template>
  <v-main>
    <v-container>
      <Webcam :img="img" />
    </v-container>
    <div class="mt-100 pt-20">
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
    </div>
  </v-main>
</template>

<script lang="ts">
import Webcam from '@/views/Webcam.vue'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import Demo from '@/store/modules/demo'
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
const DemoModule = getModule(Demo)
@Component({
  components: {
    Webcam,
  },
})
export default class Demo2 extends Vue {
  @Action('demo/saveImage') saveImage!: (img: string) => void

  img = ''
  url = ''
  file = ''
  fetchURL = ''
  canDownload = false
  downloading = false
  uploading = false
  file_object = {
    filename: '',
    uuid: '',
  }
  transferedImgKey = 0

  Preview_image() {
    console.log(this.file)
    this.canDownload = false
    this.fetchURL = ''
    if (this.transferedImgKey == 0) {
      this.transferedImgKey = 1
    } else {
      this.transferedImgKey = 0
    }
    this.url = URL.createObjectURL(this.file)
  }

  async uploadImage(formData) {
    const DemoModule: Demo = getModule(Demo)
    await DemoModule.saveImage(this.img)
  }

  async download(filename: string) {
    const response = await axios.get(
      `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`,
      // `http://localhost:8000/file/download_finished/?filename=${filename}`
    )
    if (response.status == 200) {
      // alert("Test Download Done");
      console.log(response)
      this.fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
      // this.fetchURL = `http://localhost:8000/file/download_finished/?filename=${filename}`;
      this.canDownload = true
    } else {
      alert('Download file failed')
      // this.file = "";
    }
    this.downloading = false
    // clearInterval(this.interval);
  }

  async upload() {
    const formData = new FormData()
    formData.append('file', this.file)
    this.uploading = true
    // this.interval = setInterval(() => {
    //   // console.log(this.circularValue);
    //   this.circularValue += 100;
    //   if (this.circularValue >= 10000000) {
    //     this.circularValue = 0;
    //   }
    //   // parseInt((this.circularValue.toFixed(2)) * 100;
    // }, 300);
    // setTimeout(() => this.uploadImage(formData), 2000);
    await this.uploadImage(formData)
  }

  // this.fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`;
}
</script>
