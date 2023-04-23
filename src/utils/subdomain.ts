import { cookies } from 'next/headers'

export const getSubdomain = () => {
   const cookieStore = cookies()
   return cookieStore.get('currentHost')?.value
}
