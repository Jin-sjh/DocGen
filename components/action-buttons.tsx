"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save, Download, RotateCcw } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { DataStatusIndicator } from "@/components/data-status-indicator"

interface ActionButtonsProps {
  templateId: string
  currentData: any
  onSave: (data: any) => boolean
  onReset?: () => void
  onExport?: () => void
  hasUnsavedChanges?: boolean
  isSaved?: boolean
}

export function ActionButtons({ 
  templateId, 
  currentData, 
  onSave, 
  onReset,
  onExport,
  hasUnsavedChanges = false,
  isSaved = false
}: ActionButtonsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [storageStatus, setStorageStatus] = useState<'available' | 'unavailable' | 'checking'>('checking')
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
    
    // 检查 localStorage 可用性
    try {
      localStorage.setItem('__storage_test__', 'test')
      localStorage.removeItem('__storage_test__')
      setStorageStatus('available')
    } catch (error) {
      setStorageStatus('unavailable')
    }
  }, [])

  // 在服务器端渲染时显示加载状态
  if (!isClient) {
    return (
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-shrink-0">
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
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = onSave(currentData)
      if (success) {
        toast({
          title: "保存成功",
          description: "文档数据已保存",
          duration: 3000,
        })
      } else {
        toast({
          title: "保存失败",
          description: "无法保存数据，请检查浏览器存储权限",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存过程中发生错误",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
      toast({
        title: "重置成功",
        description: "当前模板内容已清空",
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "保存中..." : "保存"}
        </Button>

        {onReset && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        )}

        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            导出
          </Button>
        )}
      </div>

      <div className="flex-shrink-0">
        <DataStatusIndicator
          hasUnsavedChanges={hasUnsavedChanges}
          isSaved={isSaved}
          templateName={templateId}
          storageStatus={storageStatus}
        />
      </div>
    </div>
  )
} 