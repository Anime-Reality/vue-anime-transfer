<template>
  <div class="home">
    <HOMEPAGE msg="Welcome to Samsan Transfer, get you ready to emerge in anime world like Ghibi"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HOMEPAGE from '@/components/HOMEPAGE.vue'; // @ is an alias to /src
@Component({
  components: {
    HOMEPAGE,
  },
})
export default class Home extends Vue {}
</script>
