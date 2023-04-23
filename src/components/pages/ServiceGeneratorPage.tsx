import { CodeBuilder } from '@/components/code-builder/CodeBuilder'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { GraphQLContentInput, ShowGQLParsedObjectCodeBlock } from '@/components/service-generator/GraphQLContentInput'
import { ServiceFileOutput } from '@/components/service-generator/ServiceFileOutput'
import { ServiceGeneratorParams } from '@/components/service-generator/ServiceGeneratorParams'
import React, { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'


interface ServiceGeneratorPageProps {
   children?: React.ReactNode
}


export const ServiceGeneratorPage: React.FC<ServiceGeneratorPageProps> = (props) => {
   
   const { children, ...rest } = props
   
   return (
      <DashboardLayout
         top={<>
         
         </>}
         rightSection={<>
            <ServiceFileOutput />
         </>}
      >
         <div className="space-y-2">
            <GraphQLContentInput />
            <ServiceGeneratorParams />
            <ShowGQLParsedObjectCodeBlock />
         </div>
      </DashboardLayout>
   )
   
}
