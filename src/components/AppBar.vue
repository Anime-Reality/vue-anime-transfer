<template>
    <v-app-bar app color="blue darken-4" dark>
      <div class="d-flex align-center">
        <h3>Samsan Tech Anime Transfer</h3>
      </div>
      <v-spacer></v-spacer>
      <!-- <v-btn
        href="https://animetransfer-cecc2q6t6a-as.a.run.app/docs"
        target="_blank"
        text
      >
        <span class="mr-2">FAST API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
      <v-btn
        href="https://samsan-transfer.gitbook.io/samsantransfer/"
        target="_blank"
        text
      >
        <span class="mr-2">DOCUMENTATION</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
</template>
<script lang="ts">
import { Vue,Component } from 'vue-property-decorator'
@Component
export default class AppBar extends Vue {
  // 
}
</script>
