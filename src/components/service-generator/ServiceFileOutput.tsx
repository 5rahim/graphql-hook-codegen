import { CodeBuilder } from '@/components/code-builder/CodeBuilder'
import { serviceGenerator_useParsedContent } from '@/components/service-generator/atoms'
import { formatClientMutationsFile } from '@/components/service-generator/outputs/mutation-services'
import { formatClientServicesFile, formatServerServicesFile } from '@/components/service-generator/outputs/query-services'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ServiceFileOutputProps {
   children?: React.ReactNode
}

export const clientServicesBuilder = _.cloneDeep(CodeBuilder).wipe()
export const serverServicesBuilder = _.cloneDeep(CodeBuilder).wipe()
export const typesBuilder = _.cloneDeep(CodeBuilder).wipe()

export const ServiceFileOutput: React.FC<ServiceFileOutputProps> = (props) => {
   
   const { children, ...rest } = props
   
   const { queries, mutations, mainFragment, keywords, dynamicParsedContent } = serviceGenerator_useParsedContent()
   
   const [clientServices, setClientServices] = useState('')
   const [serverServices, setServerServices] = useState('')
   const [typesOutput, setTypesOutput] = useState('')
   
   // Create file
   useEffect(() => {
      
      console.log('running')
      
      /**
       * Types
       */
      typesBuilder
         .wipe()
         .rawLine(`// types.ts\n`)
         .line(`import { ${dynamicParsedContent.fragmentNames.map(name => name + 'Fragment').join(', ')}, ${queries.map(query => query.name).join(', ')} } from '@/graphql/codegen/graphql'`)
         .line(`import { Nullish } from '@/types'`)
         .space()
      dynamicParsedContent.fragmentNames.map(name => {
         typesBuilder.line(`export type ${name} = Nullish<${name}Fragment>`)
      })
      
      typesBuilder.space()
      
      queries.map(query => {
         typesBuilder.line(`export type ${query.name.replace('Get', '')}Data = ${query.name}['${query.table}']${
            (!query.name.replace('Get', '').endsWith('s') && query.table.endsWith('s'))
               ? '[0]'
               : ''}`)
      })
      
      typesBuilder.space()
      
      
      /**
       * Client services
       */
      clientServicesBuilder.wipe().line('// services/xx.client.ts').space()
      // Imports
      clientServicesBuilder
         .line(`import { useCurrentUser } from '@/atoms/user.atom'`)
         .line(`import { useClientMutation, useClientQuery } from '@/graphql/helpers/use-client-graphql'`)
         .line(`import { useLinks } from '@/hooks/use-links'`)
         .line(`import { useToast } from '@/hooks/use-toast'`)
         .line(`import { InferType } from '@/types'`)
         .line(`import { createTypesafeFormSchema } from '@ui/main/forms/typesafe-form/CreateTypesafeFormSchema'`)
         .line(`import { useRouter } from 'next/navigation'`)
         // Import generated hooks (queries)
         .line(`import { ${queries.map(q => `${q.name}Document`).join(', ')} } from '@/graphql/codegen/graphql'`)
         .line(`import { ${mutations.map(q => `${q.name}Document`).join(', ')} } from '@/graphql/codegen/graphql'`)
         .line(`import { ${dynamicParsedContent.fragmentNames.join(', ')} } from '../types'`)
         .space()
      
      formatClientServicesFile(queries)
      formatClientMutationsFile(mutations, dynamicParsedContent)
      
      /**
       * Server services
       */
      serverServicesBuilder.wipe()
      
      formatServerServicesFile(queries)
      
      setServerServices(serverServicesBuilder.getStringOutput())
      setClientServices(clientServicesBuilder.getStringOutput())
      setTypesOutput(typesBuilder.getStringOutput())
      
   }, [dynamicParsedContent])
   
   return <>
      <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
         {typesOutput}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
         {serverServices}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="tsx" style={vscDarkPlus}>
         {clientServices}
      </SyntaxHighlighter>
   </>
   
}
