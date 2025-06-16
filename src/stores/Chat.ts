import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type ChatMessage, type TwitchEventSubMessage, type TwitchEventSubMetadata, type TwitchEventSubSubscription, type TwitchUser, type TwitchValidationResponse } from "@/lib/TwitchTypes";
import type { RefSymbol } from "@vue/reactivity";
import { CLIENT_ID, REDIRECT_URL, TWITCH_AUTHORIZE_URL, TWITCH_EVENTSUB, TWITCH_EVENTSUB_MAKE, TWITCH_SCOPES, TWITCH_USER_URL, TWITCH_VALIDATION_URL } from "@/lib/Const";
import axios from "axios";
import { useTwitchAuth } from "./TwitchAuth";

export const useChat = defineStore('chat',()=>{
    
    const websocket = ref<WebSocket|undefined>(undefined)
    let activeChatUsers:Map<string,TwitchUser> = new Map()
    let submittedMessages: ChatMessage[] = []

    const isConnected = computed<boolean>(()=> (websocket.value && websocket.value.readyState == WebSocket.OPEN) ?? false)

    function log(obj:string, ...params:any[]){
        console.log(`[useChat] ` + obj, params)
    }

    function connect(){
        if(websocket.value){
            websocket.value.close()
        } 

        websocket.value = new WebSocket(TWITCH_EVENTSUB)
        websocket.value.onmessage   = onMessage
        websocket.value.onclose     = (event:Event)=>{log("closing websocket")}
        websocket.value.onerror     = (event:Event)=>{log("error",event)}
        websocket.value.onopen      = (event:Event)=>{log("opening websocket")}

    }

    function disconnect(){
        if(websocket.value){
            websocket.value.close()
        } 
        websocket.value = undefined
    }

    async function subscribe(){
        console.log('subscribe')
        try {
            
        
            const response = await axios.post(TWITCH_EVENTSUB_MAKE, 
                {
                    type: "channel:chat",
                    version: "1",
                    condition: {
                        user_id: useTwitchAuth().getUser()?.id ?? "",
                        broadcaster_user_id: useTwitchAuth().getUser()?.id ?? ""
                    },
                    transport: {
                        method: "webhook",
                        callback: "https://this-is-a-callback.com",
                        secret:"s3cre7"
                    }
                }, {
                    headers:{
                        'Authorization': `Bearer ${useTwitchAuth().getAccessKey()}`,
                        'Client-Id': CLIENT_ID,
                        'Content-Type': 'application/json'
                    }
                }
                
            )
            console.log(response)
        } catch (err) {
            console.error(err)
        }
    }

    function processMessageEvent(payload:{subscription:TwitchEventSubSubscription,event:TwitchEventSubMessage}){
        console.log(payload)
    }

    function onMessage(event:MessageEvent)
    {
        console.log(`[onMessage] ` ,event.data)
        const data = event.data
        const metadata = data['metadata'] as TwitchEventSubMetadata
        const payload = data['payload']
        
        if(metadata){
            metadata.message_type 
            switch (metadata.message_type ) {
                case "session_welcome":
                    subscribe()
                    break;
                case "session_keepalive":
                    break;
                case "notification":
                    processMessageEvent(payload)
                    break;
                case "reconnecting":
                    break;
                case "revocation":
                    break;
                default:
                    break;
            }
        }
    }

    function getUserFromId(id:string){
        if(activeChatUsers.has(id))
            return activeChatUsers.get(id)
        return undefined
    }

    function getMessages(){
        return submittedMessages
    }
    function deleteMessagesFromUser(id:string){
        submittedMessages = submittedMessages.filter( msg =>{msg.user_id != id})
    }

    function deleteMessage(id:string){
        submittedMessages = submittedMessages.filter( msg =>{msg.message_id != id})
    }

    return {
        connect,
        disconnect,
        getUserFromId,
        getMessages,
        isConnected,
    }
})