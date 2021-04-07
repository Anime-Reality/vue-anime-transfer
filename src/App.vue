<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>Vue-Anime-Transfer</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="" target="_blank" text>
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
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="TextCenter"> <h3>Transfered File</h3> </v-row>
          <v-row>
            <v-img
              :src="fetchURL"
              lazy-src="https://i.stack.imgur.com/y9DpT.jpg"
              contain
              :aspect-ratio="16 / 9"
              class="pd-10 mr-10"
              width="20%"
              height="20%"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    :width="10"
                    intermediate
                    color="green"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";
// import Full from "./components/Full.vue";
// import HelloWorld from "./components/HelloWorld.vue";
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
    //
  }),
  methods: {
    async uploadImage(formData) {
      const response = await axios.post(
        "https://animetransfer-cecc2q6t6a-as.a.run.app/file/upload/",
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
        await this.download(this.file_object.filename);
      } else {
        this.file = "";
      }
      this.uploading = false;
    },
    async download(filename: string) {
      const response = await axios.get(
        `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`
      );
      if (response.status == 200) {
        // alert("Test Download Done");
        console.log(response);
        this.fetchURL = `https://animetransfer-cecc2q6t6a-as.a.run.app/file/download_finished/?filename=${filename}`;
      } else {
        alert("Download file failed");
        // this.file = "";
      }
    },
    async upload() {
      const formData = new FormData();
      formData.append("file", this.file);
      this.uploading = true;
      setTimeout(() => this.uploadImage(formData), 200);
      // await this.uploadImage(formData);
    },
    Preview_image() {
      console.log(this.file);
      this.url = URL.createObjectURL(this.file);
    },
  },
});
</script>
<style scoped>
.TextCenter {
  justify-content: center;
}
</style>
