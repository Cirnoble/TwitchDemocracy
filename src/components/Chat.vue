<template >
    <div v-for="message in useChat().Messages">
        <span>{{ message.user_name }}</span>
        <span>{{ message.text }}</span>
    </div>
</template>
<script setup lang="ts">
import { useChat } from '@/stores/Chat'


</script>