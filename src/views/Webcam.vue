<template>
  <v-main class="container">
    <div class="row">
      <v-card class="col-md-6">
        <h2>Current Camera</h2>
        <code v-if="device">{{ device.label }}</code>
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
              >
                {{ device.label }}
              </option>
            </select>
          </div>
          <div class="col-md-12">
            <v-btn variant="primary" @click="onCapture">
              Capture Photo
            </v-btn>
            <v-btn varaint="danger" @click="onStop">
              Stop Camera
            </v-btn>
            <v-btn variant="success" @click="onStart">
              Start Camera
            </v-btn>
          </div>
        </div>
      </v-card>
      <v-card class="col-md-6 mx-auto">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </v-card>
    </div>
  </v-main>
</template>

<script lang="ts">
import { WebCam } from 'vue-web-cam'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
    'vue-web-cam': WebCam,
  },
})
export default class Webcam extends Vue {
  camera: any = null
  deviceId: any = null
  devices: { deviceId: string }[] = []

  @Prop(String)
  img?: string

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

  onCapture() {
    const webcamRef: any = this.$refs.webcam
    this.img = webcamRef.capture()
    this.$store.state.demo.dispatch('save')
    console.log(this.img)
  }
  onStarted(stream) {
    console.log('On Started Event', stream)
  }
  onStopped(stream) {
    console.log('On Stopped Event', stream)
  }
  onStop() {
    const webcamRef: any = this.$refs.webcam
    webcamRef.stop()
  }
  onStart() {
    const webcamRef: any = this.$refs.webcam
    webcamRef.start()
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
