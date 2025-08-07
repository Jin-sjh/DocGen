"use client"

import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Sidebar } from "@/components/sidebar"
import { PRDGenerator } from "@/components/prd-generator"
import { ComingSoon } from "@/components/coming-soon"
import { HLDGenerator } from "@/components/hld-generator"
import { LLDGenerator } from "@/components/lld-generator"
import { DBDDGenerator } from "@/components/dbdd-generator"
import { PrototypeGenerator } from "@/components/prototype-generator"
import { SRSGenerator } from "@/components/srs-generator"
import { ActionButtons } from "@/components/action-buttons"
import { Toaster } from "@/components/ui/toaster"
import { 
  setActiveTemplate, 
  updateDocumentData, 
  setHasUnsavedChanges,
  resetDocumentData,
  resetCurrentTemplate
} from "@/store/documentSlice"
import type { RootState } from "@/store"


const templateComponents = {
  prd: {
    component: PRDGenerator,
    name: "PRD 产品需求文档",
    description: "产品需求文档模板"
  },
  hld: {
    component: HLDGenerator,
    name: "HLD 概要设计说明书",
    description: "概要设计说明书模板"
  },
  lld: {
    component: LLDGenerator,
    name: "LLD 详细设计说明书",
    description: "详细设计说明书模板"
  },
  dbdd: {
    component: DBDDGenerator,
    name: "DBDD 数据库设计文档",
    description: "数据库设计文档模板"
  },
  prototype: {
    component: PrototypeGenerator,
    name: "产品原型设计文档",
    description: "产品原型设计文档模板"
  },
  srs: {
    component: SRSGenerator,
    name: "SRS 需求规格说明书",
    description: "需求规格说明书模板"
  },
  brd: {
    component: () => <ComingSoon templateName="BRD 商业需求文档" description="商业需求文档模板，用于描述业务需求和商业价值" />,
    name: "BRD 商业需求文档",
    description: "商业需求文档模板"
  },
  mrd: {
    component: () => <ComingSoon templateName="MRD 市场需求文档" description="市场需求文档模板，用于分析市场需求和竞争环境" />,
    name: "MRD 市场需求文档", 
    description: "市场需求文档模板"
  },
  'project-plan': {
    component: () => <ComingSoon templateName="项目计划文档" description="项目计划文档模板，用于项目管理和进度跟踪" />,
    name: "项目计划文档",
    description: "项目计划文档模板"
  }
}

export default function DocumentGenerator() {
  const dispatch = useDispatch()
  const { activeTemplate, data: documentData, hasUnsavedChanges } = useSelector((state: RootState) => state.documents)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟加载状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 获取当前模板的数据
  const currentData = documentData[activeTemplate] || null
  
  // 获取所有保存的模板
  const savedTemplates = Object.keys(documentData)
  const isSaved = savedTemplates.includes(activeTemplate)
  
  // 调试信息
  console.log('Main - documentData:', documentData)
  console.log('Main - savedTemplates:', savedTemplates)
  console.log('Main - activeTemplate:', activeTemplate)
  console.log('Main - isSaved:', isSaved)

  const handleTemplateChange = (templateId: string) => {
    dispatch(setActiveTemplate(templateId))
  }

  const handleSave = (data: any) => {
    dispatch(updateDocumentData({ templateId: activeTemplate, data }))
    dispatch(setHasUnsavedChanges(false))
    return true
  }

  const handleDataChange = useCallback((data: any) => {
    dispatch(updateDocumentData({ templateId: activeTemplate, data }))
  }, [dispatch, activeTemplate])

  const handleReset = () => {
    console.log('Reset - before reset, activeTemplate:', activeTemplate)
    console.log('Reset - before reset, documentData:', documentData)
    dispatch(resetCurrentTemplate(activeTemplate))
    // 确保重置后立即清除未保存状态
    dispatch(setHasUnsavedChanges(false))
    console.log('Reset - after reset dispatched')
    
    // 强制重新渲染
    setTimeout(() => {
      console.log('Reset - forced re-render after timeout')
    }, 100)
  }

  const ActiveComponent = templateComponents[activeTemplate as keyof typeof templateComponents]?.component || PRDGenerator

  // 检查当前组件是否支持数据管理
  const supportedTemplates = ['prd', 'hld', 'lld', 'dbdd', 'prototype', 'srs']
  const isDataAwareComponent = supportedTemplates.includes(activeTemplate)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="h-20 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <Sidebar 
        activeTemplate={activeTemplate} 
        onTemplateChange={handleTemplateChange} 
      />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">

          
          {/* 操作按钮 - 为所有支持的模板显示 */}
          {isDataAwareComponent && (
            <ActionButtons
              templateId={activeTemplate}
              currentData={currentData}
              onSave={handleSave}
              onReset={handleReset}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaved={isSaved}
            />
          )}
          
          {/* 主要内容 */}
          {isDataAwareComponent ? (
            <ActiveComponent 
              initialData={currentData}
              onDataChange={handleDataChange}
            />
          ) : (
            <ActiveComponent />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
