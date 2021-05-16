<template>
  <v-main class="container">
    <div class="row">
      <v-card class="col-md-6">
        <v-row>
          <v-col>
            <h2>Current Camera</h2>
            <code v-if="device">{{ device.label }}</code>
            <!-- <v-btn variant="secondary" @click="onCapture" class="px-1 mx-3">
              TRANSFER
            </v-btn> -->
            <v-btn variant="secondary" @click="transfer" class="px-1 mx-10">
              TRANSFER in {{ seconds.toFixed(0) }}
              {{ seconds % 3 == 0 ? '...' : seconds % 3 == 1 ? '..' : '.' }}
            </v-btn>
            <!-- <v-btn variant="secondary" @click="onStop" class="px-1 mx-3">
              STOP
            </v-btn> -->
          </v-col>
        </v-row>
        <v-row>
          <div class="border">
            <vue-web-cam
              ref="webcam"
              :device-id="deviceId"
              width="100%"
              @started="onStarted"
              @stopped="onStopped"
              @error="onError"
              @cameras="onCameras"
              @camera-change="onCameraChange"
            />
          </div>

          <div class="row">
            <div class="col-md-12">
              <select v-model="camera">
                <option>-- Select Device --</option>
                <option
                  v-for="device in devices"
                  :key="device.deviceId"
                  :value="device.deviceId"
                ></option>
              </select>
            </div>
          </div>
        </v-row>
      </v-card>
      <v-card class="col-md-6 mx-auto">
        <!-- <figure class="figure" style="width: 100%;">
          <v-flex d-flex>
            <v-layout wrap>
              <v-flex md4 v-for="url in this.urls" :key="url">
                <v-card class="card-container">
                  <ImagePainter
                    :src="url"
                    style="width: 40px; height: 40px;"
                  ></ImagePainter>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </figure> -->
        <v-img :src="selectedURL" />
      </v-card>
    </div>
    <!-- <v-img :src="selectedURL" :width="300" :height="100" /> -->

    <!-- <div class="row" v-if="urls.length > 0">
      <v-carousel v-model="model">
        <v-carousel-item v-for="(url, i) in reverseURL" :key="i">
          <v-sheet height="100%" tile>
            <v-row class="fill-height" align="center" justify="center">
              <v-img :src="url"></v-img>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </div> -->
  </v-main>
</template>

<script lang="ts">
import { WebCam } from 'vue-web-cam'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import FileUploadResponse from '@/types/FileUploadResponse'

@Component({
  components: {
    'vue-web-cam': WebCam,
  },
})
export default class Webcam extends Vue {
  camera: any = null
  deviceId: any = null
  devices: { deviceId: string }[] = []
  model = 0
  colors = ['primary', 'secondary', 'yellow darken-2', 'red', 'orange']

  @PropSync('image', {
    type: String,
  })
  img!: string

  @PropSync('links', {
    type: Array as () => string[],
  })
  urls!: string[]

  // @PropSync('fileDict', {
  //   type: Object as () => { [key: string]: FileUploadResponse },
  // })
  // fileUploadedDict: { [key: string]: FileUploadResponse } = {}

  // fetchURLs() {
  //   const keys: string[] = Object.keys(this.fileUploadedDict)
  //   const keyLength = keys.length
  //   if (keys.length > 0) {
  //     for (let index = this.urls.length - 1; index < keyLength; index++) {
  //       const url = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${
  //         this.fileUploadedDict[index.toString()].filename
  //       }`
  //       this.urls.push(url)
  //     }
  //   }
  // }

  currentIndex = 0
  get selectedURL() {
    if (this.urls.length == 0) {
      return ''
    } else {
      return this.urls[this.currentIndex]
    }
  }

  handleInterval: any

  nextIndex() {
    if (this.currentIndex + 1 < this.urls.length) {
      this.currentIndex = this.currentIndex + 1
    } else {
      this.currentIndex = 0
    }
  }
  
  reverse(arr: string[]) {
    let output: string[] = []
    let i = arr.length
    while (i > 0) {
      output.push(arr[i - 1])
      i = i - 1
    }

    return output
  }

  get reverseURL() {
    return this.reverse(this.urls)
  }

  @Prop({
    type: Function as () => void,
    required: true,
  })
  upload!: (index?: number) => any

  get device() {
    return this.devices.find(
      (n: { deviceId: string }) => n.deviceId === this.deviceId,
    )
  }

  @Watch('camera')
  onCameraChanged(id: string) {
    this.deviceId = id
  }

  @Watch('devices')
  onDevicesChanged() {
    // Once we have a list select the first one
    // const [first, ...tail] = this.devices
    if (this.devices.length > 0) {
      const [first, ...tail] = this.devices
      this.camera = first.deviceId
      this.deviceId = first.deviceId
      if (first) {
        this.camera = first.deviceId
        this.deviceId = first.deviceId
      }
    }
  }

  maxIndex = 0
  maxRecords = 5
  seconds = this.maxRecords
  recordsPersecond = 1
  async onCapture() {
    this.seconds = this.seconds - 1 / this.recordsPersecond
    const webcamRef: any = this.$refs.webcam
    this.img = webcamRef.capture()
    this.upload(this.maxIndex)
    this.maxIndex = this.maxIndex + 1
  }

  @Watch('urls')
  onURLSchanged(urls: string[]) {
    if (urls.length == 2) {
      // interval for playing GIFF
      this.handleInterval = setInterval(
        this.nextIndex,
        1000 / this.recordsPersecond,
      )
    }
  }

  onStarted(stream) {
    console.log('On Started Event', stream)
  }

  onStopped(stream) {
    console.log('On Stopped Event', stream)
  }

  // onStop() {
  //   const webcamRef: any = this.$refs.webcam
  //   clearInterval(this.captureInterval)
  //   this.seconds = 0
  //   webcamRef.stop()
  // }

  captureInterval: any
  transfer() {
    const webcamRef: any = this.$refs.webcam
    webcamRef.start()
    this.captureInterval = setInterval(
      this.onCapture,
      1000 / this.recordsPersecond,
    )
    setTimeout(this.stopTransfer, this.maxRecords * 1000)
  }

  stopTransfer() {
    clearInterval(this.captureInterval)
    this.seconds = this.maxRecords
  }

  onError(error) {
    console.log('On Error Event', error)
  }

  onCameras(cameras) {
    this.devices = cameras
    console.log('On Cameras Event', cameras)
  }

  onCameraChange(deviceId) {
    this.deviceId = deviceId
    this.camera = deviceId
    console.log('On Camera Change Event', deviceId)
  }
}
</script>
