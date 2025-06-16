<template>
    <div v-if="useTwitchAuth().isAuthenticated()" class="header">
        <img
            :src="useTwitchAuth().getUser()?.profile_image_url ?? ''"
        />
        <h1>Username: {{ useTwitchAuth().getUser()?.display_name ?? "Error"}}</h1>
        <button @click="onLogout"> Logout</button>
    </div>
    <div v-else>
        <a :href="useTwitchAuth().getUserAuthUrl()">Connect to Twitch</a>
    </div>
</template>
<script setup lang="ts">
    import {useTwitchAuth} from '@/stores/TwitchAuth.ts'

    function onLogout(){
        useTwitchAuth().logout()
    }

</script>
<style lang="css" scoped>
.header{
    grid-template-columns: 1fr 5fr 1fr;
    max-height: 5rem;
    display: grid;
    border: 1px solid black
}
.header > *{
    display: inline-block;
}
img{
    height: 5rem;
}
</style>
