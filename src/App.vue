<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import AccountInfo from './components/AccountInfo.vue'
import Chat from './components/Chat.vue';
import {useTwitchAuth} from '@/stores/TwitchAuth.ts'

onMounted(()=>{
  useTwitchAuth().tryReadRedirect()
})
</script>

<template class="container">
      <AccountInfo></AccountInfo>
      <Chat></Chat>
</template>

<style scoped>
.container{
  margin: 0 auto;
  min-width: 500px;
  border: 1px solid blue;
}

</style>
