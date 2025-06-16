
export interface TwitchUser{
    id: string,
    login: string,
    display_name: string,
    type: "admin"|"global_mod"|"staff"|"",
    broadcaster_type: "affiliate"|"partner"| "",
    description: string,
    profile_image_url: string,
    offline_image_url: string,
    view_count: number,
    email: string,
    created_at: string
}

export interface TwitchValidationResponse{
  client_id: string,
  login: string,
  scopes: string[],
  user_id: string,
  expires_in: number
}

export interface TwitchEventSubSubscription{
  id:string,
  status:string,
  type:string,
  version:string,
  cost:number,
  condition:object,
  transport:{
    method:string,
    session_id:string,
  },
  created_at:string
}

export interface TwitchEventSubMessage{
    broadcaster_user_id: string,
    broadcaster_user_login: string,
    broadcaster_user_name: string,
    chatter_user_id: string,
    chatter_user_login: string,
    chatter_user_name: string,
    message_id: string,
    message: {
      text: string,
      fragments: [
        {
          type: string,
          text: string,
          cheermote: any,
          emote: any,
          mention: any
        }
      ]
    },
    color: string,
    badges: [
      {
        set_id: string,
        id: string,
        info: string
      },
      {
        set_id: string,
        id: string,
        info: string
      },
      {
        set_id: string,
        id: string,
        info: string
      }
    ],
    message_type: string,
    cheer: any,
    reply: any,
    channel_points_custom_reward_id: any,
    source_broadcaster_user_id: any,
    source_broadcaster_user_login: any,
    source_broadcaster_user_name: any,
    source_message_id: any,
    source_badges: any
  }

export interface TwitchEventSubMetadata{
  message_id: string,
  message_type: string,
  message_timestamp: string,
  subscription_type?:string,
  subscription_version?:string,
}

export interface TwitchEventSubSession{
      id: string,
      status: string,
      connected_at: string,
      keepalive_timeout_seconds: number,
      reconnect_url: string,
}

export interface TwitchEventSubNotification{
      metadata:TwitchEventSubMetadata,
      payload:{
        subscription:TwitchEventSubSubscription
        event:TwitchEventSubMessage|object
      }
}
    
export interface ChatMessage{
  message_id: string,
  user_id: string,
  text: string
}