export type GraphQLAction = {
   id: string,
   type: 'query' | 'mutation'
   name: string,
   table: string,
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
   mutationService: {
      hookName: string
      objectName: string
      objectType: string
   }
}
