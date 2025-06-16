<template >
<div v-if="useChat().isConnected"
v-for="message in useChat().getMessages()">
    <span>{{ message }}</span>
</div>
<div v-else>
    <h1>Loading</h1>
</div>
</template>
<script setup lang="ts">
import { useChat } from '@/stores/Chat';


</script>