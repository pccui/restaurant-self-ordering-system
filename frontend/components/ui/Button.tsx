'use client'
import React from 'react'
import clsx from 'clsx'

export default function Button({ children, className, variant='default', size='md', ...props }: any) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-2 text-md' : 'px-3 py-1.5 text-sm';
  const variantClass = variant === 'primary' ? 'bg-primary-500 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-500' : variant === 'destructive' ? 'bg-destructive-500 text-white' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  return (
    <button className={clsx(base, sizeClass, variantClass, className)} {...props}>
      {children}
    </button>
  )
}
