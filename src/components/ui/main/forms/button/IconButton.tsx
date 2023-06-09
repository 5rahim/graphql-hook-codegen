import { cn } from '@/lib/tailwind/tailwind-utils'
import { Button, ButtonProps } from '@ui/main/forms/button/Button'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'


const elementStyles = cva(null, {
   variants: {
      size: {
         xs: `text-xl h-6 w-6`,
         sm: `text-xl h-8 w-8`,
         md: `text-2xl h-10 w-10`,
         lg: `text-3xl h-12 w-12`,
         xl: `text-4xl h-14 w-14`,
      },
   },
   defaultVariants: {
      size: 'md',
   },
})


export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "iconSpacing" | "isUppercase">, VariantProps<typeof elementStyles> {
   icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
   
   const {
      children,
      className,
      icon,
      size,
      ...rest
   } = props
   
   return (
      <>
         <Button
            className={cn(
               'p-0',
               elementStyles({ size }),
               className,
            )}
            {...rest}
            ref={ref}
         >
            {icon}
         </Button>
      </>
   )
   
})
