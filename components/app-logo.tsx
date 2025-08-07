"use client"

import { FileText, Target, ClipboardList, Settings, Palette, BookOpen } from 'lucide-react'

interface AppLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AppLogo({ className = "", size = 'md' }: AppLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center`}>
        <FileText className="h-4 w-4 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-900">DocGen</span>
        <span className="text-xs text-gray-500">文档生成器</span>
      </div>
    </div>
  )
} 