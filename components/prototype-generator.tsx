"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Download } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface TableRow {
  [key: string]: string
}

interface PrototypeData {
  // Header info
  systemName: string
  functionName: string
  version: string
  author: string
  date: string
  filePath: string
  figmaUrl: string
  
  // Prototype info
  prototypeInfo: TableRow[]
  
  // Prototype links
  prototypeLinks: TableRow[]
  
  // Information architecture
  iaDescription: string
  
  // Page/Component list
  pageComponents: TableRow[]
  
  // Interaction flows
  mainFlow: string
  branchFlows: string
  
  // Page prototype details
  pageDetails: TableRow[]
  
  // Responsive & breakpoints
  responsiveBreakpoints: TableRow[]
  
  // Accessibility
  accessibilityFeatures: string
  
  // Data & tracking
  trackingEvents: TableRow[]
  
  // Visual specifications
  visualSpecs: string
  
  // TODOs & risks
  todosRisks: string
  
  // Review records
  reviewRecords: TableRow[]
}

interface PrototypeGeneratorProps {
  initialData?: PrototypeData | null
  onDataChange?: (data: PrototypeData) => void
}

const defaultPrototypeData: PrototypeData = {
  systemName: "",
  functionName: "",
  version: "v1.0",
  author: "",
  date: new Date().toISOString().split('T')[0],
  filePath: "",
  figmaUrl: "",
  prototypeInfo: [
    { item: "功能名称", content: "" },
    { item: "原型工具", content: "Figma" },
    { item: "设计分辨率", content: "1440×1024（Web） / 375×812（App）" },
    { item: "设计走查日期", content: "" },
    { item: "评审状态", content: "待评审" }
  ],
  prototypeLinks: [
    { platform: "Web 高保真", link: "", permission: "只读" },
    { platform: "App 高保真", link: "", permission: "可评论" },
    { platform: "可交互 Demo", link: "", permission: "无需登录" }
  ],
  iaDescription: "",
  pageComponents: [
    { id: "", name: "", purpose: "", note: "" }
  ],
  mainFlow: "",
  branchFlows: "",
  pageDetails: [
    { pageId: "", pageName: "", url: "", entry: "", elements: "", interactions: "", imageUrl: "" }
  ],
  responsiveBreakpoints: [
    { breakpoint: "", layoutChange: "", note: "" }
  ],
  accessibilityFeatures: "",
  trackingEvents: [
    { event: "", parameters: "", trigger: "" }
  ],
  visualSpecs: "",
  todosRisks: "",
  reviewRecords: [
    { reviewer: "", opinion: "", status: "", date: "" }
  ]
}

export function PrototypeGenerator({ initialData, onDataChange }: PrototypeGeneratorProps) {
  const [prototypeData, setPrototypeData] = useState<PrototypeData>(initialData || defaultPrototypeData)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setPrototypeData(initialData)
    } else {
      setPrototypeData(defaultPrototypeData)
    }
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    if (onDataChange) {
      onDataChange(prototypeData)
    }
  }, [prototypeData]) // 移除onDataChange依赖，避免无限循环

  const updateField = (field: keyof PrototypeData, value: any) => {
    setPrototypeData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof PrototypeData, defaultValue: any) => {
    setPrototypeData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: keyof PrototypeData, index: number) => {
    setPrototypeData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const updateTableRow = (field: keyof PrototypeData, index: number, key: string, value: string) => {
    setPrototypeData(prev => ({
      ...prev,
      [field]: (prev[field] as TableRow[]).map((row, i) => 
        i === index ? { ...row, [key]: value } : row
      )
    }))
  }

  const generateMarkdown = () => {
    const md = `<!-- =====================================================
产品原型设计文档（PRD-Prototyping）
系统：${prototypeData.systemName}
功能：${prototypeData.functionName}
版本：${prototypeData.version}
作者：${prototypeData.author}
日期：${prototypeData.date}
存放：${prototypeData.filePath}
工具：Figma（${prototypeData.figmaUrl}）
===================================================== -->

# 1. 原型信息

| 项目 | 内容 |
|---|---|
${prototypeData.prototypeInfo.map(info => `| ${info.item} | ${info.content} |`).join('\n')}

---

# 2. 原型链接

| 端 | 链接 | 权限 |
|---|---|---|
${prototypeData.prototypeLinks.map(link => `| ${link.platform} | [${link.platform}](${link.link}) | ${link.permission} |`).join('\n')}

---

# 3. 信息架构（IA）

${prototypeData.iaDescription}

---

# 4. 页面/组件清单

| 编号 | 页面/组件 | 用途 | 备注 |
|---|---|---|---|
${prototypeData.pageComponents.map(component => `| ${component.id} | ${component.name} | ${component.purpose} | ${component.note} |`).join('\n')}

---

# 5. 交互流程

## 5.1 主流程

${prototypeData.mainFlow}

## 5.2 分支流程

${prototypeData.branchFlows}

---

# 6. 页面原型详情

${prototypeData.pageDetails.map(page => `## ${page.pageId} ${page.pageName}

- **URL**：\`${page.url}\`
- **入口**：${page.entry}
- **新增元素**：${page.elements}
- **交互说明**：${page.interactions}

![${page.pageName}](${page.imageUrl})`).join('\n\n')}

---

# 7. 响应式 & 断点

| 断点 | 布局变化 | 备注 |
|---|---|---|
${prototypeData.responsiveBreakpoints.map(bp => `| ${bp.breakpoint} | ${bp.layoutChange} | ${bp.note} |`).join('\n')}

---

# 8. 可访问性（a11y）

${prototypeData.accessibilityFeatures}

---

# 9. 数据与埋点

| 事件 | 参数 | 触发时机 |
|---|---|---|
${prototypeData.trackingEvents.map(event => `| \`${event.event}\` | \`${event.parameters}\` | ${event.trigger} |`).join('\n')}

---

# 10. 视觉规范

${prototypeData.visualSpecs}

---

# 11. 待办 & 风险

${prototypeData.todosRisks}

---

# 12. 评审记录

| 评审人 | 意见 | 状态 | 日期 |
|---|---|---|---|
${prototypeData.reviewRecords.map(record => `| ${record.reviewer} | ${record.opinion} | ${record.status} | ${record.date} |`).join('\n')}`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prototype-${prototypeData.functionName || 'design'}-${prototypeData.version}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品原型设计文档</h1>
          <p className="text-gray-600 mt-1">填写产品原型设计文档的各个部分，完成后可导出为 Markdown 文件</p>
        </div>
        <Button
          onClick={exportMarkdown}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          导出文档
        </Button>
      </div>

      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            文档基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systemName">系统名称</Label>
              <Input
                id="systemName"
                value={prototypeData.systemName}
                onChange={(e) => updateField('systemName', e.target.value)}
                placeholder="XXX系统"
              />
            </div>
            <div>
              <Label htmlFor="functionName">功能名称</Label>
              <Input
                id="functionName"
                value={prototypeData.functionName}
                onChange={(e) => updateField('functionName', e.target.value)}
                placeholder="订单批量删除"
              />
            </div>
            <div>
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={prototypeData.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                value={prototypeData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="产品-张三 / 设计-李四"
              />
            </div>
            <div>
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={prototypeData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filePath">文档存放路径</Label>
              <Input
                id="filePath"
                value={prototypeData.filePath}
                onChange={(e) => updateField('filePath', e.target.value)}
                placeholder="/prd/prototype/order-batch-delete-proto-v1.0.md"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="figmaUrl">Figma 链接</Label>
              <Input
                id="figmaUrl"
                value={prototypeData.figmaUrl}
                onChange={(e) => updateField('figmaUrl', e.target.value)}
                placeholder="https://figma.com/file/xxxxx"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prototype Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            原型信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prototypeData.prototypeInfo.map((info, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>项目</Label>
                  <Input
                    value={info.item}
                    onChange={(e) => updateTableRow('prototypeInfo', index, 'item', e.target.value)}
                    placeholder="项目名"
                  />
                </div>
                <div>
                  <Label>内容</Label>
                  <Input
                    value={info.content}
                    onChange={(e) => updateTableRow('prototypeInfo', index, 'content', e.target.value)}
                    placeholder="内容"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prototype Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            原型链接
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>原型链接列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('prototypeLinks', { platform: '', link: '', permission: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prototypeData.prototypeLinks.map((link, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">链接 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('prototypeLinks', index)}
                    disabled={prototypeData.prototypeLinks.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>平台</Label>
                    <Input
                      value={link.platform}
                      onChange={(e) => updateTableRow('prototypeLinks', index, 'platform', e.target.value)}
                      placeholder="Web 高保真"
                    />
                  </div>
                  <div>
                    <Label>链接</Label>
                    <Input
                      value={link.link}
                      onChange={(e) => updateTableRow('prototypeLinks', index, 'link', e.target.value)}
                      placeholder="https://figma.com/file/xxxxx"
                    />
                  </div>
                  <div>
                    <Label>权限</Label>
                    <Select
                      value={link.permission}
                      onValueChange={updateTableRow.bind(null, 'prototypeLinks', index, 'permission')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择权限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="只读">只读</SelectItem>
                        <SelectItem value="可评论">可评论</SelectItem>
                        <SelectItem value="可编辑">可编辑</SelectItem>
                        <SelectItem value="无需登录">无需登录</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            信息架构（IA）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="iaDescription">信息架构描述</Label>
            <Textarea
              id="iaDescription"
              value={prototypeData.iaDescription}
              onChange={(e) => updateField('iaDescription', e.target.value)}
              placeholder="可以添加 Mermaid 流程图代码描述信息架构"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Page/Component List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            页面/组件清单
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>页面/组件列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('pageComponents', { id: '', name: '', purpose: '', note: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prototypeData.pageComponents.map((component, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">页面/组件 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('pageComponents', index)}
                    disabled={prototypeData.pageComponents.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>编号</Label>
                    <Input
                      value={component.id}
                      onChange={(e) => updateTableRow('pageComponents', index, 'id', e.target.value)}
                      placeholder="P01"
                    />
                  </div>
                  <div>
                    <Label>页面/组件</Label>
                    <Input
                      value={component.name}
                      onChange={(e) => updateTableRow('pageComponents', index, 'name', e.target.value)}
                      placeholder="订单列表页"
                    />
                  </div>
                  <div>
                    <Label>用途</Label>
                    <Input
                      value={component.purpose}
                      onChange={(e) => updateTableRow('pageComponents', index, 'purpose', e.target.value)}
                      placeholder="入口，展示订单"
                    />
                  </div>
                  <div>
                    <Label>备注</Label>
                    <Input
                      value={component.note}
                      onChange={(e) => updateTableRow('pageComponents', index, 'note', e.target.value)}
                      placeholder="新增复选框"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interaction Flows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            交互流程
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mainFlow">主流程</Label>
            <Textarea
              id="mainFlow"
              value={prototypeData.mainFlow}
              onChange={(e) => updateField('mainFlow', e.target.value)}
              placeholder="可以添加 Mermaid 流程图代码描述主要交互流程"
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="branchFlows">分支流程</Label>
            <Textarea
              id="branchFlows"
              value={prototypeData.branchFlows}
              onChange={(e) => updateField('branchFlows', e.target.value)}
              placeholder="描述各种分支情况和异常流程"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visual Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">7</Badge>
            视觉规范
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="visualSpecs">视觉规范</Label>
            <Textarea
              id="visualSpecs"
              value={prototypeData.visualSpecs}
              onChange={(e) => updateField('visualSpecs', e.target.value)}
              placeholder="- **主按钮**：#D93025 / 16 px 粗体&#10;- **圆角**：4 px&#10;- **阴影**：0 2 8 rgba(0,0,0,.12)"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
            可访问性（a11y）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="accessibilityFeatures">可访问性特性</Label>
            <Textarea
              id="accessibilityFeatures"
              value={prototypeData.accessibilityFeatures}
              onChange={(e) => updateField('accessibilityFeatures', e.target.value)}
              placeholder="- 复选框 `aria-label='选择订单号 202508060001'`&#10;- 弹窗 `role='dialog'` + `aria-modal='true'`"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">9</Badge>
            数据与埋点
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>埋点事件列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('trackingEvents', { event: '', parameters: '', trigger: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prototypeData.trackingEvents.map((event, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">埋点事件 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('trackingEvents', index)}
                    disabled={prototypeData.trackingEvents.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>事件</Label>
                    <Input
                      value={event.event}
                      onChange={(e) => updateTableRow('trackingEvents', index, 'event', e.target.value)}
                      placeholder="order_list_select"
                    />
                  </div>
                  <div>
                    <Label>参数</Label>
                    <Input
                      value={event.parameters}
                      onChange={(e) => updateTableRow('trackingEvents', index, 'parameters', e.target.value)}
                      placeholder={'{ count: 23 }'}
                    />
                  </div>
                  <div>
                    <Label>触发时机</Label>
                    <Input
                      value={event.trigger}
                      onChange={(e) => updateTableRow('trackingEvents', index, 'trigger', e.target.value)}
                      placeholder="复选框变化"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TODOs & Risks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            待办 & 风险
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="todosRisks">待办事项与风险</Label>
            <Textarea
              id="todosRisks"
              value={prototypeData.todosRisks}
              onChange={(e) => updateField('todosRisks', e.target.value)}
              placeholder="- [ ] 交互走查：iOS 15 真机测试&#10;- [ ] 文案法务确认：删除免责条款&#10;- [ ] 风险：多语言版本需要 2 天额外工作量"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">11</Badge>
            评审记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>评审记录列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('reviewRecords', { reviewer: '', opinion: '', status: '', date: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prototypeData.reviewRecords.map((record, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">评审记录 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('reviewRecords', index)}
                    disabled={prototypeData.reviewRecords.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>评审人</Label>
                    <Input
                      value={record.reviewer}
                      onChange={(e) => updateTableRow('reviewRecords', index, 'reviewer', e.target.value)}
                      placeholder="开发-王五"
                    />
                  </div>
                  <div>
                    <Label>意见</Label>
                    <Input
                      value={record.opinion}
                      onChange={(e) => updateTableRow('reviewRecords', index, 'opinion', e.target.value)}
                      placeholder="弹窗需增加 loading"
                    />
                  </div>
                  <div>
                    <Label>状态</Label>
                    <Select
                      value={record.status}
                      onValueChange={updateTableRow.bind(null, 'reviewRecords', index, 'status')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="已解决">已解决</SelectItem>
                        <SelectItem value="待排期">待排期</SelectItem>
                        <SelectItem value="进行中">进行中</SelectItem>
                        <SelectItem value="已关闭">已关闭</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>日期</Label>
                    <Input
                      type="date"
                      value={record.date}
                      onChange={(e) => updateTableRow('reviewRecords', index, 'date', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
