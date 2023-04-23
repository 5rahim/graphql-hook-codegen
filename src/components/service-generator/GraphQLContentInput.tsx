import { serviceGenerator_useGQLActionFileContent } from '@/components/service-generator/atoms'
import { useDebounce } from '@/hooks/use-debounce'
import { Textarea } from '@ui/main/forms/textarea/Textarea'
import { Title } from '@ui/main/typography/heading/Title'
import React, { memo, useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface GraphQLContentInputProps {
   children?: React.ReactNode
}


export const GraphQLContentInput: React.FC<GraphQLContentInputProps> = (props) => {
   
   const { children, ...rest } = props
   
   const { fileContent, setFileContent } = serviceGenerator_useGQLActionFileContent()
   const [text, setText] = useState(fileContent)
   const deferredFiledContent = useDebounce(text, 1000)
   
   useEffect(() => {
      setFileContent(deferredFiledContent)
   }, [deferredFiledContent])
   
   return <>
      <Title>GraphQL Action File Content</Title>
      <Textarea rows={10} onChange={e => setText(e.target.value)} value={text} />
   </>
   
}

interface CodeBlockProps {
   children?: React.ReactNode
}

export const ShowGQLParsedObjectCodeBlock: React.FC<CodeBlockProps> = memo((props) => {
   
   const { children, ...rest } = props
   
   const { parsedContent } = serviceGenerator_useGQLActionFileContent()
   
   return <>
      <SyntaxHighlighter language="json" style={vscDarkPlus}>
         {JSON.stringify(parsedContent, null, 2)}
      </SyntaxHighlighter>
   </>
   
})


