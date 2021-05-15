<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/show.jpeg')"
          class="my-3"
          contains
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Samsan Transfer
        </h1>

        <p class="subheading font-weight-regular">
          For help and growth of the platform,
          <br>please read our implementation, and our research
          <a
            href="https://samsan-transfer.gitbook.io/samsantransfer/"
            target="_blank"
          ></a>
        </p>
      </v-col>

      <v-col
        class="mb-10"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Attached Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
      <v-col>
          <v-btn rounded color="primary" dark x-large to="/demo">PROJECT DEMO</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HOMEPAGE',

    data: () => ({
      ecosystem: [
        {
          text: 'Report',
          href: 'https://samsan-transfer.gitbook.io/samsantransfer/',
        },
        {
          text: 'Github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'Collection',
          href: '',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore implementation and roadmap',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  })
</script>
