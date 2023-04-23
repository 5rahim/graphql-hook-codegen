import { clientEnv } from '@/env/schema.mjs'
import { Nullable } from '@/types'
import { GraphQLClient } from "graphql-request"
import { createClient } from 'graphql-ws'
// import WebSocket from 'ws'

export const getClient = (accessToken?: Nullable<string>, role?: string) => {
   
   return new GraphQLClient(clientEnv.NEXT_PUBLIC_HASURA_GRAPHQL_API!, {
      // @ts-ignore
      headers: accessToken ? {
         'Content-Type': 'application/json',
         Accept: 'application/json',
         Authorization: accessToken ? `Bearer ${accessToken}` : null,
         'x-hasura-role': role,
      } : {},
      cache: "no-cache",
   })
}


export const getWSClient = (accessToken?: Nullable<string>) => {
   
   if (typeof window !== undefined) {
      return createClient({
         // webSocketImpl: WebSocket,
         url: clientEnv.NEXT_PUBLIC_HASURA_WS_GRAPHQL_API!,
         connectionParams: {
            headers: accessToken ? {
               Authorization: accessToken ? `Bearer ${accessToken}` : null,
            } : {},
         },
      })
   }
   
   return null
   
}
