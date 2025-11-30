'use client'
import React from 'react'
import clsx from 'clsx'

export default function Button({ children, className, variant='default', size='md', ...props }: any) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-2 text-md' : 'px-3 py-1.5 text-sm';
  const variantClass =
    variant === 'primary' ? 'bg-primary-500 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-500' :
    variant === 'destructive' ? 'bg-destructive-500 text-white' :
    variant === 'danger' ? 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' :
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700';
  return (
    <button className={clsx(base, sizeClass, variantClass, className)} {...props}>
      {children}
    </button>
  )
}
