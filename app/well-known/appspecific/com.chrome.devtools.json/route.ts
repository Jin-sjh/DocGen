import { NextResponse } from 'next/server'

export async function GET() {
  // 返回 Chrome DevTools 期望的响应格式
  return NextResponse.json({
    name: 'DocGen 文档生成器',
    description: '智能产品需求文档生成工具',
    version: '1.0.0',
    type: 'web-application'
  }, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  })
} 