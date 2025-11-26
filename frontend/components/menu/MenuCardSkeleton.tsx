'use client'
import React from 'react'
import Card from '@/components/ui/Card'

/**
 * Loading skeleton for MenuItemCard
 * Matches the card dimensions and layout with pulse animation
 */
export default function MenuCardSkeleton() {
  return (
    <Card className="flex flex-col h-full animate-pulse">
      {/* Thumbnail placeholder - 16:9 aspect ratio */}
      <div className="aspect-video bg-gray-200" />

      {/* Content placeholder */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Name and Price placeholder */}
          <div className="flex justify-between items-start gap-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>

          {/* Description placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Taste badges placeholder */}
          <div className="flex gap-1.5">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-14" />
          </div>
        </div>

        {/* Action buttons placeholder */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="h-9 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </Card>
  )
}

/**
 * Grid of loading skeletons
 * Use this while menu data is loading
 */
export function MenuCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  )
}
