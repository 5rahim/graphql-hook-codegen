import { clientServicesBuilder, serverServicesBuilder } from '@/components/service-generator/ServiceFileOutput'
import { GraphQLAction } from '@/components/service-generator/types'
import _ from 'lodash'

function formatParametersAndVariables(hookParameters: string[], hookParameterObjects: string[], hookParameterTypes: string[], queryVariables: any) {
   const h1 = hookParameters.length > 0 ? `${hookParameters.join(', ')}` : ``
   const h2 = hookParameterObjects.length > 0 ? `{ ${hookParameterObjects.join(', ')} }: { ${hookParameterTypes.join(', ')} }` : ``
   let hookParametersString = (h1.length > 0 && h2.length > 0) ? [h1, h2].join(', ') : (h1 || h2)
   // Format the variables that will be passed to the React Query hook
   queryVariables = queryVariables.length > 0 ? ', { ' + queryVariables.join(', ') + ' }' : ''
   return { hookParametersString, queryVariables }
}

function formatQueryVariables(variable: {
   name: string;
   type: string;
   required: boolean;
   valueFrom: "parameter" | "parameters" | "custom" | "hook";
   constantName: string
}, hookParameterObjects: string[], hookParameterTypes: string[], queryVariables: any, hooks: string[], hookParameters: string[]) {
   // Parameter.
   // ({ a, b }: { a: string, b: string }) => {}
   if (variable.valueFrom === 'parameter') {
      hookParameterObjects.push(`${variable.name}`)
      hookParameterTypes.push(`${variable.name}: ${variable.type}`)
      
      queryVariables.push(`${variable.name}: ${variable.constantName}`) // Add variables to query
      
   }
      // Hook
   // const a = useA(), b = useB();
   else if (variable.valueFrom === 'hook') {
      // Custom hooks per variable name
      // const {user} = useCurrentUser()
      if (variable.name === 'user_id') {
         hooks.push(`const {user} = useCurrentUser()`)
         queryVariables.push(`${variable.name}: user?.id`) // Add variables to query
         
      }
      // Else
      else {
         hooks.push(`const ${variable.constantName} = useCurrent${_.capitalize(variable.name)}()`)
         queryVariables.push(`${variable.name}: ${variable.constantName}`) // Add variables to query
      }
   }
      // Custom
   // const a = ''
   else if (variable.valueFrom === 'custom') {
      hooks.push(`const ${variable.constantName}: ${variable.type} = ${variable.type === 'string' ? `''` : ''}${variable.type === 'number'
         ? `0`
         : ''}${variable.type === 'any' ? `{}` : ''}`)
      queryVariables.push(`${variable.name}: ${variable.constantName}`) // Add variables to query
   }
      // Parameters
   // (a: string, b: string) => {}
   else if (variable.valueFrom === 'parameters') {
      hookParameters.push(`${variable.constantName}: ${variable.type}`)
      queryVariables.push(`${variable.name}: ${variable.constantName}`) // Add variables to query
   }
}

function formatReturnDataValue(query: GraphQLAction) {
   let suffix = ''
   if(query.queryReturn === 'object' && (query.table.includes('_one') || query.table.includes('by_pk')))
      suffix = ''
   if(query.queryReturn === 'object' && !(query.table.includes('_one') || query.table.includes('by_pk')))
      suffix = `[0]`
   if(query.queryReturn === 'array')
      suffix = ` ?? []`
   return `res.data?.${query.table}${suffix}`
}

export const formatClientServicesFile = (queries: GraphQLAction[]) => {
   
   /**
    * Make query services
    */
   queries.map(query => {
      
      const hookName = query.name.replace('Get', '')
      const generatedQueryDocument = `${query.name}Document`
      let hookParameters: string[] = [] // (a: string, b: string) => {}
      let hookParameterObjects: string[] = [] // ({ a, b }: { a: string, b: string }) => {}
      let hookParameterTypes: string[] = [] // ({ a, b }: { a: string, b: string }) => {}
      let queryVariables: any = []
      let hooks: string[] = [] // const a = useA()
      
      query.variables.map(variable => {
         formatQueryVariables(variable, hookParameterObjects, hookParameterTypes, queryVariables, hooks, hookParameters)
      })
      
      // Format the parameters of the service hook
      const __ret = formatParametersAndVariables(hookParameters, hookParameterObjects, hookParameterTypes, queryVariables)
      let hookParametersString = __ret.hookParametersString
      queryVariables = __ret.queryVariables
      
      /**
       * Start query function
       */
      
      clientServicesBuilder
         .rawLine(`/*`)
         .rawLine(`* Query name: ${query.name}`)
         .rawLine(`* Generated return type: ` + (query.returnType !== 'any' ?  `${query.returnType}${query.queryReturn === 'array' ? '[]' : ''}` + ` or ${query.name.replace('Get', '')}Data` : `${query.name.replace('Get', '')}Data`))
         .startIf((!query.name.replace('Get', '').endsWith('s') && query.table.endsWith('s') && query.queryReturn === 'array'))
         .rawLine(`* TODO: /!\\ The name of the query implies that it should return an object, not an array. Please fix the generated type or the query return type.`)
         .endIf()
         .rawLine(`*/`)
      
      clientServicesBuilder.line(`export const use${hookName} = (${hookParametersString}) => {`)
      
      hooks.map(hook => clientServicesBuilder.line(hook))
      
      clientServicesBuilder
         .space()
         .line(`const res = useClientQuery(${generatedQueryDocument}${queryVariables})`) // React Query
         .line(`const data = ${formatReturnDataValue(query)}`)
         .space()
         .line(`return {`)
         .rawLine(`\ndata: data, // Rename return object/array`)
         .line(`isLoading: res.isLoading,`)
         
         .startIf(query.queryReturn === 'array')
         .line(`count: data.length,`)
         .endIf()
         
         .line(`refetch: res.refetch,`)
         .line('}')
         // .line(`onSuccess: data => {`)
         // .space()
         // .line(`},`)
         // .line(`})`)
         .space()
         .line('}')
         .space()
      
   })
   
   // return serviceFileBuilder.getStringOutput()
   
}

export const formatServerServicesFile = (queries: GraphQLAction[]) => {
   
   serverServicesBuilder.wipe().line('// services/xx.server.ts').space()
   
   serverServicesBuilder
      // Import generated hooks (queries)
      .line(`import { ${queries.map(q => `${q.name}Document`).join(', ')} } from '@/graphql/codegen/graphql'`)
      .line(`import { useServerQuery } from '@/graphql/helpers/use-server-graphql'`)
      .line(`import { Nullable } from '@/types'`)
      .line(`import { cache } from 'react'`)
      .space()
   
   queries.map(query => {
      
      const hookName = query.name.replace('Get', 'get').replace('Search', 'search').replace('List', 'getList')
      const generatedQueryDocument = `${query.name}Document`
      let hookParameters: string[] = [] // (a: string, b: string) => {}
      let hookParameterObjects: string[] = [] // ({ a, b }: { a: string, b: string }) => {}
      let hookParameterTypes: string[] = [] // ({ a, b }: { a: string, b: string }) => {}
      let queryVariables: any = []
      let hooks: string[] = [] // const a = useA()
      
      query.variables.map(variable => {
         formatQueryVariables(variable, hookParameterObjects, hookParameterTypes, queryVariables, hooks, hookParameters)
      })
      
      // Format the parameters of the service hook
      const __ret = formatParametersAndVariables(hookParameters, hookParameterObjects, hookParameterTypes, queryVariables)
      let hookParametersString = __ret.hookParametersString
      queryVariables = __ret.queryVariables
      
      serverServicesBuilder
         .rawLine(`/**`)
         .rawLine(`* Query name: ${query.name}`)
         .rawLine(`* Generated return type: ` + (query.returnType !== 'any' ?  `${query.returnType}${query.queryReturn === 'array' ? '[]' : ''}` + ` or ${query.name.replace('Get', '')}Data` : `${query.name.replace('Get', '')}Data`))
         .startIf((!query.name.replace('Get', '').endsWith('s') && query.table.endsWith('s') && query.queryReturn === 'array'))
         .rawLine(`* TODO: /!\\ The name of the query implies that it should return an object, not an array. Please fix the generated type or the query return type.`)
         .endIf()
         .rawLine(`**/`)
      
      serverServicesBuilder.line(`export const ${hookName} = cache(async (${hookParametersString}) => {`)
      
      hooks.map(hook => serverServicesBuilder.line(hook))
      
      // Query
      serverServicesBuilder
         .space()
         .line(`const res = await useServerQuery(${generatedQueryDocument}${queryVariables})`) // React Query
         .line(`const data = ${formatReturnDataValue(query)}`)
         .line(`return data`)
         .space()
         .line('})')
         .space()
      
   })
   
}
