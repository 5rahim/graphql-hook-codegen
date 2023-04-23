import { serviceGenerator_useParsedContent } from '@/components/service-generator/atoms'
import { Checkbox } from '@ui/main/forms/checkbox/Checkbox'
import { TextInput } from '@ui/main/forms/input/TextInput'
import { SegmentedControl } from '@ui/main/forms/radio/RadioGroup'
import { Select } from '@ui/main/forms/select/Select'
import { Title } from '@ui/main/typography/heading/Title'
import React from 'react'

interface ServiceGeneratorParamsProps {
   children?: React.ReactNode
}

export const ServiceGeneratorParams: React.FC<ServiceGeneratorParamsProps> = (props) => {
   
   const { children, ...rest } = props
   
   const { queries, mutations, updateAction, updateActionVariable } = serviceGenerator_useParsedContent()
   
   
   return <div>
      <div className="space-y-4">
         <Title>Query services</Title>
         {queries.map(query => {
            // console.log('024ed14b-e48f-402a-bf4a-17a32fd459dd', query.return)
            return (
               <div key={query.id} className="space-y-2 p-4 rounded-md bg-gray-50">
                  <p className="font-medium text-indigo-500">{query.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                     <TextInput
                        label="Query name"
                        value={query.name}
                        onChange={e => updateAction(query.id, 'name', e.target.value)}
                     />
                     <Select
                        label="Query return"
                        value={query.queryReturn}
                        options={[{ value: 'array' }, { value: 'object' }]}
                        onChange={e => updateAction(query.id, 'queryReturn', e.target.value)}
                     />
                     <TextInput
                        label="Service return type"
                        value={query.returnType}
                        onChange={e => updateAction(query.id, 'returnType', e.target.value)}
                     />
                  </div>
                  <div className="p-2 bg-gray-100 rounded-md space-y-2">
                        {query.variables.map(variable => {
                           return (
                              <div key={variable.name} className="flex gap-2 truncate">
                                 <div className="font-medium text-pink-600 w-14 flex-shrink-0 truncate">{variable.name}</div>
                                 <TextInput
                                    label="Constant"
                                    value={variable.constantName}
                                    onChange={e => updateActionVariable(query.id, variable.name, 'constantName', e.target.value)}
                                 />
                                 <Select
                                    label="Type"
                                    value={variable.type}
                                    options={[{ value: 'string' },{ value: 'number' }, { value: 'boolean' }, { value: 'any' }]}
                                    onChange={e => updateActionVariable(query.id, variable.name, 'type', e.target.value)}
                                 />
                                 <SegmentedControl
                                    label="Value"
                                    value={variable.valueFrom}
                                    options={[{ value: 'parameters' }, { value: 'parameter' }, { value: 'hook' }, { value: 'custom' }]}
                                    onChange={e => updateActionVariable(query.id, variable.name, 'valueFrom', e)}
                                 />
                              </div>
                           )
                        })}
                  </div>
               </div>
            )
         })}
         {mutations.map(action => {
            // console.log('024ed14b-e48f-402a-bf4a-17a32fd459dd', action.return)
            return (
               <div key={action.id} className="space-y-2 p-4 rounded-md bg-gray-50">
                  <p className="font-medium text-indigo-500">{action.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                     <TextInput
                        label="Query name"
                        value={action.name}
                        onChange={e => updateAction(action.id, 'name', e.target.value)}
                     />
                     <Select
                        label="Query return"
                        value={action.queryReturn}
                        options={[{ value: 'array' }, { value: 'object' }]}
                        onChange={e => updateAction(action.id, 'queryReturn', e.target.value)}
                     />
                     <TextInput
                        label="Service return type"
                        value={action.returnType}
                        onChange={e => updateAction(action.id, 'returnType', e.target.value)}
                     />
                  </div>
                  {/*<div className="p-2 bg-gray-100 rounded-md space-y-2">*/}
                  {/*   {action.variables.map(variable => {*/}
                  {/*      return (*/}
                  {/*         <div key={variable.name} className="flex gap-2 truncate">*/}
                  {/*            <div className="font-medium text-pink-600 w-24 flex-shrink-0 truncate">{variable.name}</div>*/}
                  {/*            <Checkbox*/}
                  {/*               label="Value"*/}
                  {/*               checked={variable.include}*/}
                  {/*               onChange={e => updateActionVariable(action.id, variable.name, 'include', e)}*/}
                  {/*            />*/}
                  {/*         </div>*/}
                  {/*      )*/}
                  {/*   })}*/}
                  {/*</div>*/}
               </div>
            )
         })}
      </div>
   </div>
   
}
