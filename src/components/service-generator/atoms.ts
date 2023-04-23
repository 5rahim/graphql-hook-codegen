import { GraphQLAction, GraphQLParsedContent } from '@/components/service-generator/types'
import { parseGraphQL } from '@/components/service-generator/utils'
import { atom, useAtom, useAtomValue } from 'jotai'
import { withImmer } from 'jotai-immer'
import _ from 'lodash'
import { useCallback, useEffect } from 'react'


/**
 * Contains the content of the GraphQL Action File.
 * Content consists of constants defining schemas
 */
const graphql_action_file_content_atom = withImmer(atom(`
export const AGRICWORK_OFFER_FRAGMENT = graphql(\`
  fragment AgricworkOffer on agricwork_offers {
    address
    age_range
    description
    contract_type
    country
    created_at
    duration
    education
    email
    gender
    id
    insurance
    languages
    marital_status
    monthly_salary_range
    name
    perks
    phone
    site
    skills
    status
    updated_at
    user_id
    offer_number
    min_experience
  }
\`)
export const AGRICWORK_SEARCHED_OFFER_FRAGMENT = graphql(\`
  fragment AgricworkSearchedOffer on agricwork_offers {
    id
    skills
    address
    status
    education
    duration
    contract_type
    age_range
    site
    marital_status
    gender
    monthly_salary_range
    created_at
    min_experience
  }
\`)

export const CreateAgricworkOffer = graphql(\`
  mutation CreateAgricworkOffer($offer_number: String!, $min_experience: Int!, $insurance: String!, $address: String!, $age_range: String!, $description: String!, $contract_type: String!, $country: String!, $duration: String!, $email: String!, $gender: String!, $marital_status: String!, $monthly_salary_range: String!, $name: String!, $phone: String!, $site: String!, $status: String!, $user_id: uuid!, $education: jsonb!, $languages: jsonb!, $perks: jsonb!, $skills: jsonb!) {
    insert_agricwork_offers_one(object: {offer_number: $offer_number, min_experience: $min_experience, insurance: $insurance, address: $address, age_range: $age_range, description: $description, contract_type: $contract_type, country: $country, duration: $duration, email: $email, gender: $gender, marital_status: $marital_status, monthly_salary_range: $monthly_salary_range, name: $name, phone: $phone, site: $site, status: $status, user_id: $user_id, education: $education, languages: $languages, perks: $perks, skills: $skills}) {
      ...AgricworkOffer
    }
  }
\`)

export const GetAgricworkEmployerOffers = graphql(\`
  query GetAgricworkEmployerOffers($user_id: uuid!) {
    agricwork_offers(where: {user_id: {_eq: $user_id}}, order_by: {created_at: desc, status: desc}) {
      ...AgricworkOffer
    }
  }
\`)

export const GetAgricworkOffer = graphql(\`
  query GetAgricworkOffer($id: uuid!) {
    agricwork_offers_by_pk(id: $id) {
      ...AgricworkOffer
    }
  }
\`)


export const UpdateAgricworkOffer = graphql(\`
  mutation UpdateAgricworkOffer($id: uuid!, $min_experience: Int!, $insurance: String!, $address: String!, $age_range: String!, $description: String!, $contract_type: String!, $country: String!, $duration: String!, $email: String!, $gender: String!, $marital_status: String!, $monthly_salary_range: String!, $name: String!, $phone: String!, $site: String!, $education: jsonb!, $languages: jsonb!, $perks: jsonb!, $skills: jsonb!, $updated_at: timestamptz!) {
    update_agricwork_offers_by_pk(pk_columns: {id: $id}, _set: { insurance: $insurance, min_experience: $min_experience, address: $address, age_range: $age_range, description: $description, contract_type: $contract_type, country: $country, duration: $duration, email: $email, gender: $gender, marital_status: $marital_status, monthly_salary_range: $monthly_salary_range, name: $name, phone: $phone, site: $site, education: $education, languages: $languages, perks: $perks, skills: $skills, updated_at: $updated_at}) {
      ...AgricworkOffer
    }
  }
\`)

export const SearchAgricworkOffers = graphql(\`
  query SearchAgricworkOffers($limit: Int = 10, $where: agricwork_offers_bool_exp = {}) {
    agricwork_offers(limit: $limit, where: $where, order_by: {created_at: desc, status: desc}) {
      ...AgricworkSearchedOffer
    }
  }
\`)

export const ListAgricworkOffers = graphql(\`
  query ListAgricworkOffers($limit: Int = 10, $offset: Int = 0, $where: agricwork_offers_bool_exp = {}) {
    agricwork_offers(limit: $limit, offset: $offset, where: $where, order_by: {created_at: desc, status: desc}) {
      ...AgricworkSearchedOffer
    }
  }
\`)

export const GetAgricworkOfferAggregate = graphql(\`
  query GetAgricworkOfferAggregate($where: agricwork_offers_bool_exp = {}) {
    agricwork_offers_aggregate(where: $where) {
      aggregate {
        count(columns: id)
      }
    }
  }
\`)

export const DeleteAgricworkOffer = graphql(\`
  mutation DeleteAgricworkOffer($id: uuid!) {
    delete_agricwork_offers_by_pk(id: $id) {
      id
    }
  }
\`)

`))

const graphql_parsed_content_atom = atom<GraphQLParsedContent>((get) => parseGraphQL(get(graphql_action_file_content_atom)) ?? null)


export const serviceGenerator_useGQLActionFileContent = () => {
   
   const [fileContent, setFileContent] = useAtom(graphql_action_file_content_atom)
   const [parsedContent, setParsedContent] = useAtom(graphql_parsed_content_atom)
   
   return {
      fileContent,
      setFileContent,
      parsedContent,
      setParsedContent,
   }
   
}

// @ts-ignore
const dynamic_parsed_content_atom = withImmer(atom<GraphQLParsedContent>({ fields: [], keywords: [], actions: [], mutationService: {} }))

export const serviceGenerator_useParsedContent = () => {
   
   const parsedContent = useAtomValue(graphql_parsed_content_atom)
   
   const [dynamicParsedContent, setDynamicParsedContent] = useAtom(dynamic_parsed_content_atom)
   
   useEffect(() => {
       if(dynamicParsedContent.actions.length === 0) {
          setDynamicParsedContent(parsedContent)
       }
   }, [parsedContent])
   
   const queries = dynamicParsedContent.actions.filter(n => n.type === 'query')
   const mutations = dynamicParsedContent.actions.filter(n => n.type === 'mutation')
   
   /**
    * @example
    * updateAction(query.id, 'return', value)
    */
   const updateAction = useCallback((id: string, target: keyof GraphQLAction, value: any) => {
      const clonedContent = _.cloneDeep(dynamicParsedContent)
      setDynamicParsedContent(_.update(clonedContent, `actions[${_.findIndex(clonedContent.actions, n => n.id === id)}].${target}`, v => value))
   }, [dynamicParsedContent])
   
   const updateActionVariable = useCallback((id: string, variableName: string, target: keyof GraphQLAction['variables'][number], value: any) => {
      const clonedContent = _.cloneDeep(dynamicParsedContent)
      const actionIndex = _.findIndex(clonedContent.actions, n => n.id === id)
      setDynamicParsedContent(_.update(clonedContent, `actions[${actionIndex}].variables[${_.findIndex(clonedContent.actions[actionIndex].variables, n => n.name === variableName)}].${target}`, v => value))
   }, [dynamicParsedContent])
   
   return {
      parsedContent,
      dynamicParsedContent,
      queries,
      keywords: dynamicParsedContent.keywords,
      mutations,
      mutationService: dynamicParsedContent.mutationService,
      actions: dynamicParsedContent.actions,
      updateAction,
      updateActionVariable,
      updateParsedContent: (content: GraphQLParsedContent) => {
         if(content) {
            setDynamicParsedContent(content)
         }
      }
   }
   
}

