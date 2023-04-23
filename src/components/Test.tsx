import { Textarea } from '@ui/main/forms/textarea/Textarea'
import { withImmer } from 'jotai-immer'
import { atom, useAtom } from 'jotai'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, tomorrow, atomDark, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface TestProps {
   children?: React.ReactNode
}

const testAtom = withImmer(atom(`

`))

export const Test: React.FC<TestProps> = (props) => {
   
   const { children, ...rest } = props
   const [test, setTest] = useAtom(testAtom)
   
   return (
      <>
         {/*<pre>{JSON.stringify(SyntaxHighlighter.supportedLanguages, null, 2)}</pre>*/}
         <Textarea rows={10} onChange={e => setTest(e.target.value)}  value={test}  />
         <pre>{JSON.stringify(parseGraphQL(test), null, 2)}</pre>
         {/*<SyntaxHighlighter language="graphql" style={vscDarkPlus}>*/}
         {/*   {test}*/}
         {/*</SyntaxHighlighter>*/}
      </>
   )
   
}

function parseGraphQL(queryString: string): { fieldNames: string[], keywords: string[] } {
   // extract the GraphQL operation type from the query string
   const operationType = queryString.match(/(query|mutation)/)?.[0] ?? '';
   
   // extract the field names from the query string using a regular expression
   const fieldNames = queryString.match(/[\w\d_]+(?=[\s\r\n]*\{)/g) ?? [];
   
   // extract the keywords from the query string based on the operation type
   const keywords = [];
   if (operationType === 'query') {
      if (queryString.includes('Get')) {
         keywords.push('Get');
      }
   } else if (operationType === 'mutation') {
      if (queryString.includes('Create')) {
         keywords.push('Create');
      }
      if (queryString.includes('Update')) {
         keywords.push('Update');
      }
      if (queryString.includes('Delete')) {
         keywords.push('Delete');
      }
   }
   
   return { fieldNames, keywords };
}
