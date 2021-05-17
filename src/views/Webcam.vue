<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Current Camera</h2>
        <code v-if="device">{{ device.label }}</code>
        <select v-model="camera">
          <option>-- Select Device --</option>
          <option
            v-for="device in devices"
            :key="device.deviceId"
            :value="device.deviceId"
          ></option>
        </select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="mt-3">
        <v-btn
          color="secondary"
          @click="prepareToTransfer"
          class="px-1 ml-5"
          style="width: 80%;"
        >
          TRANSFER in {{ seconds.toFixed(2) }}
          <!-- {{ seconds % 3 == 0 ? '...' : seconds % 3 == 1 ? '..' : '.' }} -->
        </v-btn>
      </v-col>
      <v-col class="mt-3">
        <v-btn
          color="error"
          @click="onReset"
          class="px-1 ml-5"
          style="width: 80%;"
        >
          RESET
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!hideWebcam">
        <v-card>
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
        </v-card>
      </v-col>

      <!-- <img :src="selectedURL" style="width: 150px; height: 150px;" /> -->
      <v-col v-if="hideWebcam">
        <v-card>
          <v-img
            :src="selectedURL"
            lazy-src="https://i.stack.imgur.com/y9DpT.jpg"
            contain
            :aspect-ratio="16 / 9"
            class="pd-10"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <vue-ellipse-progress :loading="processing" />
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { WebCam } from 'vue-web-cam'
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import FileUploadResponse from '@/types/FileUploadResponse'
import VueEllipseProgress from 'vue-ellipse-progress'
Vue.use(VueEllipseProgress)
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
  processing = false

  @PropSync('image', {
    type: String,
  })
  img!: string

  @PropSync('links', {
    type: Array as () => string[],
  })
  urls!: string[]

  currentIndex = 0
  get selectedURL() {
    if (this.urls.length == 0) {
      return ''
    } else {
      return this.urls[this.currentIndex]
    }
  }

  handleInterval: any

  up = 1
  nextIndex() {
    if (this.currentIndex + 1 < this.urls.length && this.currentIndex >= 0) {
      this.currentIndex = this.currentIndex + 1 * this.up
      if (this.currentIndex + 1 * this.up == this.urls.length) {
        this.up = -1
      }
      if (this.currentIndex + 1 * this.up < 0) {
        this.up = 1
      }
    } else {
      this.currentIndex = 0
    }
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
  maxSeconds = 1
  seconds = this.maxSeconds
  recordsPersecond = 30
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
      this.processing = false
      this.handleInterval = setInterval(
        this.nextIndex,
        2000 / this.recordsPersecond,
      )
    }
  }

  onStarted(stream) {
    console.log('On Started Event', stream)
  }

  onStopped(stream) {
    console.log('On Stopped Event', stream)
  }

  onReset() {
    clearInterval(this.captureInterval)
    this.hideWebcam = false
    this.seconds = this.maxSeconds
    const webcamRef: any = this.$refs.webcam
    webcamRef.stop()
    webcamRef.start()
  }

  captureInterval: any
  hideWebcam = false
  transfer() {
    const webcamRef: any = this.$refs.webcam
    webcamRef.start()
    this.hideWebcam = false
    this.urls = []
    this.processing = true
    this.captureInterval = setInterval(
      this.onCapture,
      1000 / this.recordsPersecond,
    )
    setTimeout(this.stopTransfer, this.maxSeconds * 1000)
  }

  prepareToTransfer() {
    setTimeout(() => this.transfer())
  }

  stopTransfer() {
    clearInterval(this.captureInterval)
    this.hideWebcam = true
    this.seconds = this.maxSeconds
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
