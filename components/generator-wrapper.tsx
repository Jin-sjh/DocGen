"use client"

import { ReactNode } from "react"

interface GeneratorWrapperProps {
  children: ReactNode
  initialData?: any
  onDataChange?: (data: any) => void
}

export function GeneratorWrapper({ children, initialData, onDataChange }: GeneratorWrapperProps) {
  // 这个包装器用于处理那些还没有更新props的生成器组件
  // 当所有生成器都更新后，这个包装器可以移除
  return <>{children}</>
} 