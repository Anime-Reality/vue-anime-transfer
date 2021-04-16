<template>
  <v-app>
    <v-app-bar app color="blue darken-4" dark>
      <div class="d-flex align-center">
        <h2>Samsan Tech Anime Transfer</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://animetransfer-cecc2q6t6a-as.a.run.app/docs"
        target="_blank"
        text
      >
        <!-- <v-btn href="http://localhost:8000/docs" target="_blank" text> -->
        <span class="mr-2">FAST API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-row class="pd-10 mg-5 mt-5">
        <v-file-input
          show-size
          accept="image/*"
          label="Upload Image File or Video File"
          prepend-icon=""
          @change="Preview_image"
          class="mx-10"
          prepend-inner-icon="mdi-file"
          v-model="file"
        ></v-file-input>
        <v-btn
          class="mr-10 mt-2"
          outlined
          color="blue darken-4"
          dark
          v-if="file"
          @click="upload"
          :loading="uploading"
          >Upload & Process</v-btn
        >
      </v-row>
      <v-row justify="center" v-if="file">
        <v-col cols="6">
          <v-row class="TextCenter"><h3>Raw File</h3> </v-row>
          <v-row>
            <v-img
              :src="url"
              contain
              :aspect-ratio="16 / 9"
              class="pd-10"
              width="20%"
              height="20%"
            >
              <!-- <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template> -->
            </v-img>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="TextCenter"> <h3>Transfered File</h3> </v-row>
          <v-row>
            <v-img
              :key="transferedImgKey"
              :src="fetchURL"
              lazy-src="https://i.stack.imgur.com/y9DpT.jpg"
              contain
              :aspect-ratio="16 / 9"
              class="pd-10"
              width="20%"
              height="20%"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <vue-ellipse-progress :loading="!uploading && downloading" />
                </v-row>
              </template>
            </v-img>
          </v-row>
        </v-col>
      </v-row>

      <v-row justify="center" v-if="canDownload">
        <v-btn
          class="mt-4"
          outlined
          color="blue darken-4"
          dark
          :href="fetchURL"
          target="_blank"
        >
          Download
        </v-btn>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";
// import Full from "./components/Full.vue";
import VueEllipseProgress from "vue-ellipse-progress";
Vue.use(VueEllipseProgress);

interface FileUploadResponse {
  filename: string;
  uuid: string;
}
export default Vue.extend({
  name: "App",

  data: () => ({
    file: "",
    file_object: {
      filename: "",
      uuid: "",
    },
    uploading: false,
    processing: false,
    url: "",
    fetchURL: "",
    circularValue: 0,
    interval: 0,
    downloading: false,
    canDownload: false,
    transferedImgKey: 0,
    //
  }),
  methods: {
    async uploadImage(formData) {
      const response = await axios.post(
        "https://animetransfer-cecc2q6t6a-as.a.run.app/file/upload/",
        // "http://localhost:8000/file/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        // alert("Upload done");
        this.file_object = response.data;
        this.canDownload = false;
        this.uploading = false;
        this.downloading = true;
        // setTimeout(
        //   async () => await this.download(this.file_object.filename),
        //   10000
        // );
        await this.download(this.file_object.filename);
      } else {
        this.uploading = false;
        this.file = "";
      }
    },
    async download(filename: string) {
      const response = await axios.get(
        `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
        // `http://localhost:8000/file/download_finished/?filename=${filename}`
      );
      if (response.status == 200) {
        // alert("Test Download Done");
        console.log(response);
        this.fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`;
        // this.fetchURL = `http://localhost:8000/file/download_finished/?filename=${filename}`;
        this.canDownload = true;
      } else {
        alert("Download file failed");
        // this.file = "";
      }
      this.downloading = false;
      // clearInterval(this.interval);
    },
    async upload() {
      const formData = new FormData();
      formData.append("file", this.file);
      this.uploading = true;
      // this.interval = setInterval(() => {
      //   // console.log(this.circularValue);
      //   this.circularValue += 100;
      //   if (this.circularValue >= 10000000) {
      //     this.circularValue = 0;
      //   }
      //   // parseInt((this.circularValue.toFixed(2)) * 100;
      // }, 300);
      // setTimeout(() => this.uploadImage(formData), 2000);
      await this.uploadImage(formData);
    },
    Preview_image() {
      console.log(this.file);
      this.canDownload = false;
      this.fetchURL = "";
      if (this.transferedImgKey == 0) {
        this.transferedImgKey = 1;
      } else {
        this.transferedImgKey = 0;
      }
      this.url = URL.createObjectURL(this.file);
    },
    mounted() {},
  },
});
</script>
<style scoped>
.TextCenter {
  justify-content: center;
}
</style>
