import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { type ChatMessage, type TwitchEventSubMessage, type TwitchEventSubMetadata, type TwitchEventSubSubscription, type TwitchUser, type TwitchValidationResponse } from "@/lib/TwitchTypes";
import type { Ref, RefSymbol } from "@vue/reactivity";
import { CLIENT_ID, REDIRECT_URL, SUBMIT_PREFIX, TWITCH_AUTHORIZE_URL, TWITCH_EVENTSUB, TWITCH_EVENTSUB_MAKE, TWITCH_SCOPES, TWITCH_USER_URL, TWITCH_VALIDATION_URL, VOTE_PREFIX } from "@/lib/Const";
import axios from "axios";
import { useTwitchAuth } from "./TwitchAuth";

class Message{
    
    id?:string;
    user_id?: string;
    message_id?: string;
    text?:string;
    votes = ref(0)

    constructor(user_id:string, message_id:string, text:string){
        this.id = useChat().getNextMessageId().toString()
        this.user_id = user_id
        this.message_id = message_id
        this.text = text
    }   

    incrementVotes(num:number=1){
        this.votes.value += num
        return this.votes
    }

    getVotes(){
        return this.votes.value
    }

}

export const useChat = defineStore('chat',()=>{
    
    const websocket = ref<WebSocket|undefined>(undefined)
    const sessionId = ref<string|undefined>(undefined)
    const ideasList:Ref<Message[]> = ref([])
    const submittedMessages = ref< ChatMessage[]>([])
    let activeChatUsers:Map<string,TwitchUser> = new Map()

    const isConnected = computed<boolean>(()=>websocket.value != undefined )
    const Messages = computed( ()=>submittedMessages.value )
    const nextMessageId = ref<number>(1)

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
        websocket.value.onerror     = (event:Event)=>{log("error", event)}
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
                    type: "channel.chat.message",
                    version: "1",
                    condition: {
                        user_id: useTwitchAuth().getUser()?.id ?? "",
                        broadcaster_user_id: useTwitchAuth().getUser()?.id ?? ""
                    },
                    transport: {
                        method: "websocket",
                        session_id: sessionId.value
                    }
                }, {
                    headers:{
                        'Authorization': `Bearer ${useTwitchAuth().getAccessToken()}`,
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

    function addIdea( source:ChatMessage ){
        let msg = new Message(source.user_id,source.message_id,source.text) 
        ideasList.value.push(msg)
    }

    function addVote(id:string){
        const found = ideasList.value.find( m =>( m.id ?? '')==id)
        found?.incrementVotes()
    }

    function processMessageEvent(payload:{subscription:TwitchEventSubSubscription,event:TwitchEventSubMessage}){
        console.log(payload)
        const user_id = payload.event.chatter_user_id
        const user_name = payload.event.chatter_user_name
        const msgId = payload.event.message_id
        const fragments = payload.event.message.fragments
        let msg:string = fragments.map((f)=>f.text).join(' ')
        let cmsg:ChatMessage = {
            message_id: msgId,
            user_id:user_id,
            user_name:user_name,
            text:msg,
        }

        if(cmsg.text.startsWith(SUBMIT_PREFIX)){
            addIdea(cmsg)
            console.log('message', cmsg)
        }else  if(cmsg.text.startsWith(VOTE_PREFIX)){
            
        }
    }

    async function onMessage(event:MessageEvent)
    {
        const data = JSON.parse(event.data)
        const metadata = data['metadata'] as TwitchEventSubMetadata
        const payload = data['payload']

        if(metadata){
            metadata.message_type 
            switch (metadata.message_type ) {
                case "session_welcome":
                    sessionId.value = payload.session.id
                    console.log('session id', sessionId.value)
                    await subscribe()
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
        submittedMessages.value = submittedMessages.value.filter( msg =>{msg.user_id != id})
    }

    function deleteMessage(id:string){
        submittedMessages.value = submittedMessages.value.filter( msg =>{msg.message_id != id})
    }

    function getNextMessageId(){
        return nextMessageId.value++
    }

    return {
        connect,
        disconnect,
        getUserFromId,
        getNextMessageId,
        Messages,
        isConnected,
    }
})