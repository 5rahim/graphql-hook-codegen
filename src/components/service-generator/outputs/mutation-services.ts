import { clientServicesBuilder } from '@/components/service-generator/ServiceFileOutput'
import { GraphQLAction, GraphQLParsedContent } from '@/components/service-generator/types'
import _ from 'lodash'

function formatVariableDefaultValueFromType(type: string) {
   return `${type === 'string' ? `''` : ''}${type === 'number'
      ? `0`
      : ''}${type === 'any' ? `{}` : ''}`
}

export const formatClientMutationsFile = (mutations: GraphQLAction[], parsedContent: GraphQLParsedContent) => {
   
   const objectName = parsedContent.mainFragment.objectName
   const objectType = parsedContent.mainFragment.objectType
   
   /**
    * Start mutation function
    */
   
   clientServicesBuilder.line(`export const use${parsedContent.mainFragment.hookName}Service = (role: 'create' | 'update', ${objectName}?: ${objectType}) => {`)
                        .line(`const router = useRouter()`)
                        .line(`const links = useLinks()`)
                        .line(`const toast = useToast()`)
                        .space()
   
   clientServicesBuilder
      .rawLine(`// TODO: Uncomment or delete /!\\`)
      .rawLine(`// const uploadHandler = useDropzoneHandler("single", { accept: { 'image/*': ['.png', '.jpeg', '.jpg'] }, required: true })`)
      .rawLine(`//`)
      .rawLine(`// @example Put inside mutation function`)
      .rawLine(`// const ${_.camelCase('mutate' + parsedContent.mainFragment.hookName.replace('Get', ''))} = async () => {`)
      .rawLine(`//   if(uploadHandler.canUpload()) {`)
      .rawLine(`//      const file = await uplaoder.uploadSingleFile()`)
      .rawLine(`//      /* Mutation functions */`)
      .rawLine(`//   }`)
      .rawLine(`// }`)
   
   mutations.map(mutation => {
      
      const mutationName = _.camelCase(mutation.name.replace('Get', '') + 'Mutation')
      const generatedQueryDocument = `${mutation.name}Document`
      
      clientServicesBuilder
         .space()
         .line(`const ${mutationName} = useClientMutation(${generatedQueryDocument}, {`) // React Query
         .line(`\nonSuccess: async (data) => {`)
         .rawLine('\n/* Success event. e.g: router.push(links.to(s => s.main.home)) */')
         .line(`toast.successAlert()`)
         .startIf(mutationName.toLowerCase().includes('update'))
         .rawLine(`\n/* await queryClient.refetchQueries({ queryKey: ['QueryName'], exact: true }) */`)
         .endIf()
         .line(`},`)
         .line(`})`)
   })
   
   // Schema
   clientServicesBuilder
      .space()
      .rawLine(`/*`)
      .rawLine(`* Schema`)
      .rawLine(`*/`)
      .line(`const ${_.camelCase(parsedContent.mainFragment.hookName)}Schema = createTypesafeFormSchema(({ z, presets }) => z.object({`)
   
   const schemaVariables = _.uniqBy(_.flatten(parsedContent.actions.map(n => n.variables)), 'name').filter(n => n.include)
   
   parsedContent.fields.filter(n => !n.includes('_id') && n !== 'id' && !n.includes('_at')).map(field => {
      const action = _.find(schemaVariables, n => n.name === field)
      if (action) {
         let zodType = action.type
         if (action.type === 'string') zodType = `z.string()`
         else if (action.type === 'boolean') zodType = `presets.switch`
         else if (action.type === 'number') zodType = `z.number().min(0)`
         else if (action.type === 'any') zodType = `z.any(), // Update type`
         clientServicesBuilder.rawLine(`${field}: ${zodType}${action.required ? `` : `.nullish()`},`)
      }
   })
   
   clientServicesBuilder.line(`}))`)
                        .space()
   
   // Mutation function
   const inferType = "InferType<" + "typeof " + _.camelCase(parsedContent.mainFragment.hookName) + "Schema" + ">"
   
   clientServicesBuilder
      .rawLine(`/*`)
      .rawLine(`* Mutation function`)
      .rawLine(`*/`)
   
   clientServicesBuilder
      .line(`const ${_.camelCase('mutate' + parsedContent.mainFragment.hookName.replace('Get', ''))} = async (data: ${inferType}) => {`) // React
                                                                                                                                         // Query
   
   // Create
   clientServicesBuilder
      .line(`\nif(role === 'create') {`)
   
   mutations.filter(n => n.name.toLowerCase().includes('create')).map(mutation => {
      const mutationName = _.camelCase(mutation.name.replace('Get', '') + 'Mutation')
      
      const excludedVariables = mutation.variables.filter(n => n.name.includes('_id') || n.name === 'id' || n.name.includes('_at'))
      
      clientServicesBuilder
         .line(`${mutationName}.mutate({`) // React Query
         .line(`\n...data,`)
      
      excludedVariables.map(variable => {
         clientServicesBuilder.rawLine(`${variable.name}: ${formatVariableDefaultValueFromType(variable.type)}, // Update value`)
      })
      
      clientServicesBuilder
         .line(`})`)
   })
   
   clientServicesBuilder.line(`}`)
   
   // Update
   clientServicesBuilder
      .line(`\nif(role === 'update' && ${objectName}) {`)
   
   mutations.filter(n => n.name.toLowerCase().includes('update')).map(mutation => {
      const mutationName = _.camelCase(mutation.name.replace('Get', '') + 'Mutation')
      const excludedVariables = mutation.variables.filter(n => n.name.includes('_id') || n.name === 'id' || n.name.includes('_at'))
      
      clientServicesBuilder
         .line(`${mutationName}.mutate({`) // React Query
         .line(`\n...data,`)
      
      excludedVariables.map(variable => {
         clientServicesBuilder.rawLine(`${variable.name}: ${variable.name === 'id'
            ? `${objectName}?.id`
            : formatVariableDefaultValueFromType(variable.type)}, // Update value`)
      })
      
      clientServicesBuilder
         .line(`})`)
   })
   
   clientServicesBuilder.line(`}`)
   
   clientServicesBuilder
      .line(`}`)
   
   
   // Default values
   clientServicesBuilder
      .space()
      .line(`const defaultValues: any = role === 'create' ? {`)
   
   parsedContent.fields.filter(n => !n.includes('_id') && n !== 'id' && !n.includes('_at')).map(field => {
      const variable = _.find(schemaVariables, n => n.name === field)
      if (variable) {
         clientServicesBuilder.line(`\n${field}: ${variable.type === 'string' ? `''` : ''}${variable.type === 'number'
            ? `0`
            : ''}${variable.type === 'any' ? `{}, // Update default value` : ''},`)
      }
   })
   
   clientServicesBuilder.line(`} : {`)
   
   parsedContent.fields.filter(n => !n.includes('_id') && n !== 'id' && !n.includes('_at')).map(field => {
      const variable = _.find(schemaVariables, n => n.name === field)
      if (variable) {
         clientServicesBuilder
            .line(`\n${field}: ${objectName}?.${field},`)
      }
   })
   
   clientServicesBuilder.line(`}`)
                        .space()
   
   
   clientServicesBuilder.line(`return {`)
                        .line(`\ndefaultValues,`)
                        .line(`${_.camelCase(parsedContent.mainFragment.hookName)}Schema,`)
                        .line(`${_.camelCase('mutate' + parsedContent.mainFragment.hookName)},`)
      // deleteXXXX: deleteXXXXMutation.mutate
                        .rawLine(`${mutations.filter(n => n.name.toLowerCase().includes('delete')).map(mutation => _.camelCase(mutation.name))[0]}: ${mutations.filter(n => n.name.toLowerCase().includes('delete')).map(mutation => _.camelCase(mutation.name))[0]}Mutation.mutate,`)
   mutations.filter(n => !n.name.toLowerCase().includes('delete')).map(mutation => {
      const mutationName = _.camelCase(mutation.name.replace('Get', '') + 'Mutation')
      clientServicesBuilder.rawLine(`// ${mutationName.replace('Mutation', '')}: ${mutationName}.mutate`)
   })
   clientServicesBuilder.rawLine(`// uploadHandler,`)
                        .line('}')
   clientServicesBuilder.space()
                        .line('}')
                        .space()
   
   // return serviceFileBuilder.getStringOutput()
   
}
