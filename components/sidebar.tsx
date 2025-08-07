"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, ClipboardList, Target, Users, Calendar, Settings, ChevronLeft, ChevronRight, ChevronDown, Palette, BarChart3, BookOpen, Save, RotateCcw } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AppLogo } from "@/components/app-logo"
import { useDocumentStorage } from "@/hooks/use-document-storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'available' | 'coming-soon'
}

interface SidebarProps {
  activeTemplate: string
  onTemplateChange: (templateId: string) => void
}

const designDocTemplates: Template[] = [
  {
    id: 'prd',
    name: 'PRD 文档',
    description: '产品需求文档',
    icon: <FileText className="h-5 w-5" />,
    status: 'available'
  },
  {
    id: 'hld',
    name: 'HLD 文档',
    description: '概要设计说明书',
    icon: <Target className="h-5 w-5" />,
    status: 'available'
  },
  {
    id: 'lld',
    name: 'LLD 文档',
    description: '详细设计说明书',
    icon: <ClipboardList className="h-5 w-5" />,
    status: 'available'
  },
  {
    id: 'dbdd',
    name: 'DBDD 文档',
    description: '数据库设计文档',
    icon: <Settings className="h-5 w-5" />,
    status: 'available'
  }
]

const requirementAnalysisTemplates: Template[] = [
  {
    id: 'prototype',
    name: '原型设计文档',
    description: '产品原型设计文档',
    icon: <Palette className="h-5 w-5" />,
    status: 'available'
  },
  {
    id: 'srs',
    name: 'SRS 文档',
    description: '需求规格说明书',
    icon: <BookOpen className="h-5 w-5" />,
    status: 'available'
  }
]

const otherTemplates: Template[] = [
  {
    id: 'brd',
    name: 'BRD 文档',
    description: '商业需求文档',
    icon: <Users className="h-5 w-5" />,
    status: 'coming-soon'
  },
  {
    id: 'mrd',
    name: 'MRD 文档',
    description: '市场需求文档',
    icon: <Calendar className="h-5 w-5" />,
    status: 'coming-soon'
  },
  {
    id: 'project-plan',
    name: '项目计划',
    description: '项目管理文档',
    icon: <BarChart3 className="h-5 w-5" />,
    status: 'coming-soon'
  }
]

export function Sidebar({ activeTemplate, onTemplateChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDesignDocsOpen, setIsDesignDocsOpen] = useState(true)
  const [isRequirementAnalysisOpen, setIsRequirementAnalysisOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  const { data: documentData, resetAllData } = useDocumentStorage()
  
  // 确保组件已挂载后再获取保存的模板
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const savedTemplates = isMounted ? Object.keys(documentData) : []
  
  // 调试信息
  console.log('Sidebar - documentData:', documentData)
  console.log('Sidebar - savedTemplates:', savedTemplates)

  const handleReset = () => {
    resetAllData()
    onTemplateChange('prd')
  }

  const renderTemplateButton = (template: Template) => {
    const isSaved = savedTemplates.includes(template.id)
    
    return (
      <Button
        variant={activeTemplate === template.id ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-auto p-3",
          isCollapsed && "px-2",
          template.status === 'coming-soon' && "opacity-60 cursor-not-allowed"
        )}
        onClick={() => {
          if (template.status === 'available') {
            onTemplateChange(template.id)
          }
        }}
        disabled={template.status === 'coming-soon'}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="flex-shrink-0">
            {template.icon}
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{template.name}</span>
                {isSaved && (
                  <Save className="h-3 w-3 text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </div>
          )}
        </div>
      </Button>
    )
  }

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <AppLogo size="sm" />
          )}
          {isCollapsed && (
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 p-4 space-y-2">
        {!isCollapsed && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">文档模板</h2>
          </div>
        )}
        
        {/* Design Document Templates - Collapsible */}
        <Collapsible open={isDesignDocsOpen} onOpenChange={setIsDesignDocsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-auto p-2 mb-2",
                isCollapsed && "px-2"
              )}
            >
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium text-gray-600">设计文档模板</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isDesignDocsOpen && "rotate-180"
                  )} />
                </>
              )}
              {isCollapsed && <Settings className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {designDocTemplates.map((template) => (
              <div key={template.id} className={cn("ml-2", isCollapsed && "ml-0")}>
                {renderTemplateButton(template)}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Requirement Analysis Templates - Collapsible */}
        <Collapsible open={isRequirementAnalysisOpen} onOpenChange={setIsRequirementAnalysisOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-auto p-2 mb-2",
                isCollapsed && "px-2"
              )}
            >
              {!isCollapsed && (
                <>
                  <span className="text-sm font-medium text-gray-600">需求分析文档模板</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isRequirementAnalysisOpen && "rotate-180"
                  )} />
                </>
              )}
              {isCollapsed && <Palette className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {requirementAnalysisTemplates.map((template) => (
              <div key={template.id} className={cn("ml-2", isCollapsed && "ml-0")}>
                {renderTemplateButton(template)}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Other Templates */}
        {!isCollapsed && (
          <div className="mt-4 mb-2">
            <h3 className="text-sm font-medium text-gray-600">其他模板</h3>
          </div>
        )}
        
        {otherTemplates.map((template) => (
          <div key={template.id}>
            {renderTemplateButton(template)}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <>
          <Separator />
          <div className="p-4 space-y-3">
            {/* Reset Button */}
            {savedTemplates.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    重置所有数据
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重置</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作将清除所有已保存的文档数据，包括所有模板的填写内容。此操作不可撤销，请确认是否继续？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      确认重置
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 rounded-full p-1">
                    <Settings className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-900">
                      更多模板即将推出
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      我们正在开发更多文档模板，敬请期待！
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Collapsed Footer */}
      {isCollapsed && savedTemplates.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认重置</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将清除所有已保存的文档数据，包括所有模板的填写内容。此操作不可撤销，请确认是否继续？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    确认重置
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  )
}
