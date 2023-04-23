import { GraphQLAction, GraphQLParsedContent } from '@/components/service-generator/types'
import _ from 'lodash'

export function parseGraphQL(queryString: string): GraphQLParsedContent {
   let fields: string[] = []
   
   // Lines
   const lines = queryString.split('\n').map(n => n.trim())
   
   /** Get fields **/
   const fragmentStartIndex = _.findIndex(lines, n => n.startsWith('fragment'))
   const fragmentEndIndex = _.findIndex(lines, n => n.startsWith('}'))
   fields = _.clone(lines).slice(fragmentStartIndex + 1, fragmentEndIndex)
   
   // Get all fragments
   const fragmentNames: string[] = []
   lines.map(line => {
      if(line.startsWith('fragment')) {
         fragmentNames.push(line.split(/[\s+]/)[1])
      }
   })
   
   /** Get keywords **/
   const keywords: string[] = []
   if (queryString.includes('Get')) keywords.push('Get')
   if (queryString.includes('Update')) keywords.push('Update')
   if (queryString.includes('Create')) keywords.push('Create')
   if (queryString.includes('Delete')) keywords.push('Delete')
   
   const fragmentName = lines[fragmentStartIndex].split(/[\s+]/)[1]
   /* Main fragment */
   const mainFragment = {
      hookName: fragmentName ?? '',
         objectName: !!fragmentName ? _.camelCase(fragmentName) : 'object',
         objectType: !!fragmentName ? _.startCase(fragmentName)?.split(' ')?.join('') : 'any'
   }
   
   // Go through each line to get actions
   let actions: GraphQLAction[] = []
   lines.filter(n => n.includes('query ') || n.includes('mutation ')).map((line) => {
      try {
         const actualIndex = _.findIndex(lines, n => _.isEqual(line, n))
         let words = line.split(/[\s+]/) // Get all words. e.g: ['query', 'GetAgricworkApplicantByUserId($user_id:', 'uuid!)', '{']
         const actionType = words[0] as ('query' | 'mutation')
         const actionName = words[1].split('(')[0] ?? words[1]
         const parameters = line.split(actionName)[1].replace('(', '').replace(')', '').replace(' {', '').replace('{', '').split(',').map(n => n.trim())
         
         console.log(parameters)
         
         let nextLine = lines[actualIndex + 1]
         let returnLine = lines[actualIndex+2].trim()
         let tableName = nextLine.split('(')[0].trim().replace('update_', '').replace('insert_', '').replace('delete_', '')
         let originalTableName = nextLine.split('(')[0].trim().replace('update_', '').replace('insert_', '').replace('delete_', '').replace('_one', '').replace('_by_pk', '').replace('_aggregate', '')
         // Define action
         let action: GraphQLAction = {
            id: crypto.randomUUID(),
            type: actionType,
            name: actionName,
            // e.g: agricwork_offers
            table: tableName,
            originalTable: originalTableName,
            // e.g: gricwork_offers_by_pk -> object
            queryReturn: (!nextLine.includes('_by_pk') && !nextLine.includes('_aggregate')) ? 'array' : 'object',
            returnType: returnLine.includes('...') ? returnLine.replace('...', '')  : 'any',
            variables: parameters.filter(n => n.length > 0).map(parameter => {
               const name = parameter.split(':')[0].replace('$', '')
               let type = parameter.split(':').map(n => n.trim())[1]
               const required = type.includes('!')
               let tsType = 'string'
               
               if (type.includes('String')) {
                  tsType = 'string'
               } else if (type.includes('Text')) {
                  tsType = 'string'
               } else if (type.includes('Boolean')) {
                  tsType = 'boolean'
               } else if (type.includes('timestamptz')) {
                  tsType = 'string'
               } else if (type.includes('Int')) {
                  tsType = 'number'
               } else if (type.includes('uuid')) {
                  tsType = 'string'
               } else if (type.includes('jsonb')) {
                  tsType = 'any'
               } else if (type.includes('_exp')) {
                  tsType = 'any'
               } else if (type.includes('_set_')) {
                  const tn = originalTableName.split('_').length > 1 ? originalTableName.split('_').map(n => _.capitalize(n)).join('_') : originalTableName
                  tsType = tn + '_Set_Input'
               }
               
               return {
                  name,
                  type: tsType,
                  required,
                  constantName: _.camelCase(name),
                  valueFrom: actionType === 'query' ? 'parameters' : 'custom',
                  include: true
               }
            }),
         }
         actions.push(action)
      }
      catch (e) {
         console.log(e)
      }
   })
   
   return {
      fields, keywords, actions, mainFragment, fragmentNames,
   }
}
