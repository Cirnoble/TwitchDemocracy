<template>
    <div >
        <div v-if="useTwitchAuth().isAuthenticated()" class="header">
            <img
            :src="useTwitchAuth().getUser()?.profile_image_url ?? ''"
            />
            <h1>Username: {{ useTwitchAuth().getUser()?.display_name ?? "Error"}}</h1>
            <button @click="onLogout"> Logout</button>
        </div>
        <div v-else class="header">
            <span> </span>
            <a :href="useTwitchAuth().getUserAuthUrl()">Connect to Twitch</a>
            <span> </span>
        </div>
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
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    height: 5rem;
    background-color: grey;
    border-color: black;
    border-style: solid;
    border-radius: 0px 0px 10px 10px;
    border-width: 0 0 2px 0;
    box-sizing: content-box;
}

.header > *{
    display: inline-block;
}

.header > a{
    margin: auto;
    padding: 1rem;
    border: 1px solid;
    border-radius: 10px;
    font: bold 2rem black;
}
.header > a:hover{
    border-color: black;
}

img{
    height: 5rem;
}
</style>
