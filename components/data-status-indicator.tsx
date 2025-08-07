"use client"

import { Badge } from "@/components/ui/badge"
import { Save, AlertTriangle, CheckCircle, Database, XCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from 'react'

interface DataStatusIndicatorProps {
  hasUnsavedChanges: boolean
  isSaved: boolean
  templateName: string
  storageStatus?: 'available' | 'unavailable' | 'checking'
}

export function DataStatusIndicator({ 
  hasUnsavedChanges, 
  isSaved, 
  templateName,
  storageStatus = 'checking'
}: DataStatusIndicatorProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 在服务器端渲染时显示加载状态
  if (!isClient) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <span className="text-sm">加载中...</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
          <span className="text-xs">检查存储...</span>
        </div>
      </div>
    )
  }

  // 存储状态指示器
  const StorageStatusIndicator = () => {
    if (storageStatus === 'checking') {
      return (
        <div className="flex items-center gap-1 text-gray-400">
          <Database className="h-3 w-3 animate-pulse" />
          <span className="text-xs">检查存储...</span>
        </div>
      )
    }
    
    if (storageStatus === 'unavailable') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-red-500">
                <XCircle className="h-3 w-3" />
                <span className="text-xs">存储不可用</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>localStorage不可用，数据无法保存</p>
              <p className="text-xs text-gray-400 mt-1">
                请检查浏览器设置或尝试刷新页面
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    
    return (
      <div className="flex items-center gap-1 text-green-500">
        <Database className="h-3 w-3" />
        <span className="text-xs">存储正常</span>
      </div>
    )
  }

  // 数据状态指示器
  const DataStatus = () => {
    if (hasUnsavedChanges) {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">未保存的更改</span>
        </div>
      )
    }

    if (isSaved) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">已保存</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Save className="h-4 w-4" />
        <span className="text-sm">未保存</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <DataStatus />
      <StorageStatusIndicator />
    </div>
  )
} 