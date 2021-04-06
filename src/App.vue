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
        <v-btn class="mr-10 mt-2" @click="upload" :loading="uploading"
          >Upload</v-btn
        >
      </v-row>
      <v-row justify="center" v-if="file">
        <v-img
          :src="url"
          contain
          :aspect-ratio="16 / 9"
          width="300px"
          height="300px"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-img
          :src="fetchURL"
          lazy-src="https://i.stack.imgur.com/y9DpT.jpg"
          contain
          width="300px"
          height="300px"
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
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import UploadButton from "vuetify-upload-button";
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
    async update(formData) {
      const response = await axios.post(
        "http://localhost:8000/file/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        alert("Upload done");
        this.file_object = response.data;
        await this.download(this.file_object.filename);
      }
      // handle file here. File will be an object.
      // If multiple prop is true, it will return an object array of files.
    },
    async download(filename: string) {
      const response = await axios.get(
        `http://localhost:8000/file/download_finished/?filename=${filename}`
      );
      if (response.status == 200) {
        alert("download done");
        console.log(response);
        // const blob = new FileReader(response.data, {
        //   type: response.headers["content-type"],
        // });
        this.fetchURL = `http://localhost:8000/file/download_finished/?filename=${filename}`;
        // const reader = new FileReader();
        // reader.addEventListener("load", () => {
        //   this.fetchURL = reader.result as string;
        // });
        // reader.readAsDataURL(new Blob([response.data]));
      } else {
        alert("download file failed");
        // TODO upload again
      }
    },
    upload() {
      const formData = new FormData();
      formData.append("file", this.file);
      this.uploading = false;
      this.update(formData);
      this.uploading = false;
    },
    Preview_image() {
      console.log(this.file);
      this.url = URL.createObjectURL(this.file);
    },
  },
});
</script>
