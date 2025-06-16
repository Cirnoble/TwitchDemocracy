import { ref } from "vue";
import { defineStore } from "pinia";
import { type TwitchUser, type TwitchValidationResponse } from "@/lib/TwitchTypes";
import type { RefSymbol } from "@vue/reactivity";
import { CLIENT_ID, REDIRECT_URL, TWITCH_AUTHORIZE_URL, TWITCH_SCOPES, TWITCH_USER_URL, TWITCH_VALIDATION_URL } from "@/lib/Const";
import axios from "axios";
import { useChat } from "./Chat";

export const useTwitchAuth = defineStore('twitch-auth',()=>{
    
    const accessKey = ref<string|undefined>(undefined)
    const user = ref<TwitchUser|undefined>(undefined)
    const isLoading = ref(false)

    function getAccessKey(){
        return accessKey.value
    }

    function getUser(){
        return user.value
    }
    
    function isAuthenticated(){
        return !(accessKey.value == undefined && user.value == undefined)
    }   

    function logout(){
        accessKey.value = undefined
        user.value = undefined
    }

    function getUserAuthUrl(){
        return `${TWITCH_AUTHORIZE_URL}?response_type=token&force_verify=true&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${TWITCH_SCOPES.join(encodeURIComponent(' '))}`
    }

    function getValueFromHash(hash: string, param: string): string | undefined {
        try {
            // If there's no hash or it's just '#', return null
            if (!hash || hash === '#') {
                return undefined;
            }
            // Remove the leading '#' from the hash
            const hashParams = new URLSearchParams(hash.substring(1));
            // Return the value of the specified parameter
            const value = hashParams.get(param) ?? undefined;
            return value;
        } catch (error) {
            console.error("Invalid URL provided:", error);
            return undefined;
        }
    }

    async function tryReadRedirect(){

        const hash = window.document.location.hash
        if(hash.includes('access_token')){
            isLoading.value = true
            const token = getValueFromHash(hash,'access_token')
            accessKey.value = token

            const response = await axios.get<TwitchValidationResponse>(TWITCH_VALIDATION_URL,{
                headers:{
                    Authorization: `OAuth ${token}`
                }
            })

            const fetchedUser = await fetchUser(response.data.user_id)
            console.log(fetchedUser)
            if(fetchedUser){
                user.value = fetchedUser
                useChat().connect()
            }else{
                logout()
            }
            isLoading.value = false
        }else if(hash.includes('error')){
            logout()
        }
    }

    async function fetchUser(user_id:string) {
        try {
            const response = await axios.get<{data:TwitchUser[]}>(`${TWITCH_USER_URL}id=${user_id}`,{
                headers:{
                    'Authorization': `Bearer ${accessKey.value}`,
                    'Client-Id': CLIENT_ID
                }
            })
            console.log(response.data)
            return response.data.data[0] ??undefined
        } catch (err) {
            console.error(err)
            logout()
        }
        return undefined
    }

    return {
        isAuthenticated,
        getAccessKey,
        getUser,
        logout,
        getUserAuthUrl,
        tryReadRedirect,
        fetchUser,
    }
})