export type GraphQLAction = {
   id: string,
   type: 'query' | 'mutation'
   name: string,
   table: string,
   originalTable: string,
   queryReturn: 'array' | 'object'
   returnType: string
   variables: {
      name: string,
      type: string,
      required: boolean,
      valueFrom: 'parameter' | 'parameters' | 'custom' | 'hook',
      constantName: string
      include: boolean
   }[]
}

export type GraphQLParsedContent = {
   fields: string[],
   keywords: string[],
   actions: GraphQLAction[]
   fragmentNames: string[]
   mainFragment: {
      hookName: string
      objectName: string
      objectType: string
   }
}
