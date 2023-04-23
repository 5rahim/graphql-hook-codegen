export default {
   serviceBuilder: {
      hooks: [
         { variable: 'route', name: 'useRouter', from: 'next/navigation' },
         { variable: 'queryClient', name: 'useQueryClient', from: '@/graphql/use-query-client' },
         { variable: 'links', name: 'useLinks', from: '@/hooks/use-links' },
      ],
   },
}
