import { cn } from '@/lib/tailwind/tailwind-utils'
import { Popover } from '@headlessui/react'
import React from 'react'

interface DashboardLayoutProps {
   children?: React.ReactNode
   rightSection: React.ReactNode
   top: React.ReactNode
}

const navigation = [
   { name: 'Service generator', href: '/', current: true },
   { name: 'TypesafeForm generator', href: '/typesafeform', current: false },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
   
   const { children, rightSection, top, ...rest } = props
   
   return <>
      <div className="min-h-full bg-gray-100">
         <Popover as="header" className="bg-gray-800 pb-24">
            {({ open }) => (
               <>
                  <div className="mx-auto px-4 sm:px-6 w-full lg:px-8">
                     <div className="hidden border-white border-opacity-20 py-5 lg:block">
                        <div className="grid grid-cols-3 items-center gap-8">
                           <div className="col-span-2">
                              <nav className="flex space-x-4">
                                 {navigation.map((item) => (
                                    <a
                                       key={item.name}
                                       href={item.href}
                                       className={cn(
                                          item.current ? 'text-white' : 'text-indigo-100',
                                          'text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10',
                                       )}
                                       aria-current={item.current ? 'page' : undefined}
                                    >
                                       {item.name}
                                    </a>
                                 ))}
                              </nav>
                           </div>
                        </div>
                     </div>
                  </div>
               
               </>
            )}
         </Popover>
         <main className="-mt-24 pb-8">
            <div className="mx-auto px-4 sm:px-6 w-full lg:px-8">
               <h1 className="sr-only">Page title</h1>
               
               <div>
                  {top}
               </div>
               
               {/* Main 3 column grid */}
               <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-8">
                  {/* Left column */}
                  <div className="grid grid-cols-1 gap-4">
                     <section aria-labelledby="section-1-title">
                        <h2 className="sr-only" id="section-1-title">
                           Section title
                        </h2>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                           <div className="p-6 space-y-2">
                              {children}
                           </div>
                        </div>
                     </section>
                  </div>
                  
                  {/* Right column */}
                  <div className="grid grid-cols-1 gap-4">
                     <section aria-labelledby="section-2-title">
                        <h2 className="sr-only" id="section-2-title">
                           Section title
                        </h2>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                           <div className="p-6 space-y-2">{rightSection}</div>
                        </div>
                     </section>
                  </div>
               </div>
            </div>
         </main>
         <footer>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
               <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
                  <span className="block sm:inline"></span>{' '}
                  <span className="block sm:inline">All rights reserved.</span>
               </div>
            </div>
         </footer>
      </div>
   </>
   
}
