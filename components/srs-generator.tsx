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

interface SRSData {
  // Header info
  systemName: string
  moduleName: string
  version: string
  author: string
  date: string
  filePath: string
  
  // Introduction
  introduction: TableRow[]
  
  // General description
  generalDescription: TableRow[]
  
  // Business requirements
  businessRequirements: TableRow[]
  
  // Functional requirements
  useCaseDiagram: string
  useCaseDetails: TableRow[]
  userStories: TableRow[]
  
  // Non-functional requirements
  nonFunctionalReqs: TableRow[]
  
  // Data requirements
  dataRequirements: TableRow[]
  
  // Interface specifications
  interfaceSpecs: TableRow[]
  
  // Acceptance criteria
  acceptanceCriteria: string[]
  
  // Risks & assumptions
  risksAssumptions: TableRow[]
  
  // Appendix
  appendix: string[]
}

interface SRSGeneratorProps {
  initialData?: SRSData | null
  onDataChange?: (data: SRSData) => void
}

const defaultSRSData: SRSData = {
  systemName: "",
  moduleName: "",
  version: "v1.0",
  author: "",
  date: new Date().toISOString().split('T')[0],
  filePath: "",
  introduction: [
    { category: "1.1 目的", content: "" },
    { category: "1.2 范围", content: "" },
    { category: "1.3 名词解释", content: "" },
    { category: "1.4 参考资料", content: "" }
  ],
  generalDescription: [
    { category: "2.1 业务背景", content: "" },
    { category: "2.2 用户角色", content: "" },
    { category: "2.3 运行环境", content: "" }
  ],
  businessRequirements: [
    { id: "", description: "", criteria: "" }
  ],
  useCaseDiagram: "",
  useCaseDetails: [
    { field: "用例编号", content: "" },
    { field: "用例名称", content: "" },
    { field: "参与者", content: "" },
    { field: "前置条件", content: "" },
    { field: "基本流", content: "" },
    { field: "备选流", content: "" },
    { field: "异常流", content: "" },
    { field: "后置条件", content: "" }
  ],
  userStories: [
    { role: "", story: "", value: "" }
  ],
  nonFunctionalReqs: [
    { dimension: "", indicator: "", requirement: "" }
  ],
  dataRequirements: [
    { dataItem: "", type: "", source: "", usage: "", retention: "" }
  ],
  interfaceSpecs: [
    { interface: "", description: "", format: "" }
  ],
  acceptanceCriteria: [""],
  risksAssumptions: [
    { risk: "", probability: "", impact: "", mitigation: "" }
  ],
  appendix: [""]
}

export function SRSGenerator({ initialData, onDataChange }: SRSGeneratorProps) {
  const [srsData, setSRSData] = useState<SRSData>(initialData || defaultSRSData)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setSRSData(initialData)
    } else {
      setSRSData(defaultSRSData)
    }
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    if (onDataChange) {
      onDataChange(srsData)
    }
  }, [srsData]) // 移除onDataChange依赖，避免无限循环

  const updateField = (field: keyof SRSData, value: any) => {
    setSRSData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof SRSData, defaultValue: any) => {
    setSRSData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: keyof SRSData, index: number) => {
    setSRSData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof SRSData, index: number, value: any) => {
    setSRSData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }))
  }

  const updateTableRow = (field: keyof SRSData, index: number, key: string, value: string) => {
    setSRSData(prev => ({
      ...prev,
      [field]: (prev[field] as TableRow[]).map((row, i) => 
        i === index ? { ...row, [key]: value } : row
      )
    }))
  }

  const generateMarkdown = () => {
    const md = `<!-- =====================================================
需求规格说明书（SRS）
系统：${srsData.systemName}
模块：${srsData.moduleName}
版本：${srsData.version}
作者：${srsData.author}
日期：${srsData.date}
存放：${srsData.filePath}
===================================================== -->

# 1. 引言

| 类别 | 内容 |
|---|---|
${srsData.introduction.map(item => `| **${item.category}** | ${item.content} |`).join('\n')}

---

# 2. 综合描述

| 类别 | 内容 |
|---|---|
${srsData.generalDescription.map(item => `| **${item.category}** | ${item.content} |`).join('\n')}

---

# 3. 业务需求

| 编号 | 需求描述 | 验收标准 |
|---|---|---|
${srsData.businessRequirements.map(req => `| ${req.id} | ${req.description} | ${req.criteria} |`).join('\n')}

---

# 4. 功能需求

> 采用 **Use Case + 用户故事** 双轨描述。

## 4.1 用例图

${srsData.useCaseDiagram}

## 4.2 用例详述

| 字段 | 内容 |
|---|---|
${srsData.useCaseDetails.map(detail => `| **${detail.field}** | ${detail.content} |`).join('\n')}

## 4.3 用户故事

| 角色 | 故事 | 价值 |
|---|---|---|
${srsData.userStories.map(story => `| ${story.role} | ${story.story} | ${story.value} |`).join('\n')}

---

# 5. 非功能需求

| 维度 | 指标 | 需求描述 |
|---|---|---|
${srsData.nonFunctionalReqs.map(req => `| **${req.dimension}** | ${req.indicator} | ${req.requirement} |`).join('\n')}

---

# 6. 数据需求

| 数据项 | 类型 | 来源 | 用途 | 存储期限 |
|---|---|---|---|---|
${srsData.dataRequirements.map(req => `| ${req.dataItem} | ${req.type} | ${req.source} | ${req.usage} | ${req.retention} |`).join('\n')}

---

# 7. 接口规范

| 端点 | 方法 | 请求示例 | 响应示例 | 错误码 |
|---|---|---|---|---|
${srsData.interfaceSpecs.map(spec => `| \`${spec.endpoint}\` | ${spec.method} | \`${spec.request}\` | \`${spec.response}\` | ${spec.errorCode} |`).join('\n')}

---

# 8. 验收标准（DoD）

${srsData.acceptanceCriteria.filter(item => item.trim()).map(item => `- [ ] ${item}`).join('\n')}

---

# 9. 风险与假设

| 风险 | 等级 | 缓解措施 |
|---|---|---|
${srsData.risksAssumptions.map(risk => `| ${risk.risk} | ${risk.level} | ${risk.mitigation} |`).join('\n')}

---

# 10. 附录

${srsData.appendix.filter(item => item.trim()).map(item => `- ${item}`).join('\n')}

---

> **签字区**  
> 产品：_______  技术：_______  测试：_______  业务：_______`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `srs-${srsData.moduleName || 'module'}-${srsData.version}.md`
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
          <h1 className="text-2xl font-bold text-gray-900">SRS 需求规格说明书</h1>
          <p className="text-gray-600 mt-1">填写需求规格说明书的各个部分，完成后可导出为 Markdown 文件</p>
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
                value={srsData.systemName}
                onChange={(e) => updateField('systemName', e.target.value)}
                placeholder="XXX系统"
              />
            </div>
            <div>
              <Label htmlFor="moduleName">模块名称</Label>
              <Input
                id="moduleName"
                value={srsData.moduleName}
                onChange={(e) => updateField('moduleName', e.target.value)}
                placeholder="订单批量删除"
              />
            </div>
            <div>
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={srsData.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                value={srsData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="产品经理-张三 / 业务分析师-李四"
              />
            </div>
            <div>
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={srsData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filePath">文档存放路径</Label>
              <Input
                id="filePath"
                value={srsData.filePath}
                onChange={(e) => updateField('filePath', e.target.value)}
                placeholder="/docs/srs/order-batch-delete-srs-v1.0.md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            引言
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {srsData.introduction.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>类别</Label>
                  <Input
                    value={item.category}
                    onChange={(e) => updateTableRow('introduction', index, 'category', e.target.value)}
                    placeholder="1.1 目的"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>内容</Label>
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateTableRow('introduction', index, 'content', e.target.value)}
                    placeholder="本文档用于定义功能的业务需求、功能需求、非功能需求"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            综合描述
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {srsData.generalDescription.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>类别</Label>
                  <Input
                    value={item.category}
                    onChange={(e) => updateTableRow('generalDescription', index, 'category', e.target.value)}
                    placeholder="2.1 业务背景"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>内容</Label>
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateTableRow('generalDescription', index, 'content', e.target.value)}
                    placeholder="客服工单显示 38% 用户因无法批量删除已取消订单投诉"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            业务需求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>业务需求列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('businessRequirements', { id: '', description: '', criteria: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {srsData.businessRequirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">业务需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('businessRequirements', index)}
                    disabled={srsData.businessRequirements.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>编号</Label>
                    <Input
                      value={req.id}
                      onChange={(e) => updateTableRow('businessRequirements', index, 'id', e.target.value)}
                      placeholder="BR-01"
                    />
                  </div>
                  <div>
                    <Label>需求描述</Label>
                    <Textarea
                      value={req.description}
                      onChange={(e) => updateTableRow('businessRequirements', index, 'description', e.target.value)}
                      placeholder="买家可在订单列表选择 ≤100 条订单进行批量删除"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>验收标准</Label>
                    <Textarea
                      value={req.criteria}
                      onChange={(e) => updateTableRow('businessRequirements', index, 'criteria', e.target.value)}
                      placeholder="选择 0/1/50/100 条均可成功删除，响应 ≤2 s"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Functional Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            功能需求
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="useCaseDiagram">用例图</Label>
            <Textarea
              id="useCaseDiagram"
              value={srsData.useCaseDiagram}
              onChange={(e) => updateField('useCaseDiagram', e.target.value)}
              placeholder="可以添加 Mermaid 用例图代码"
              rows={6}
            />
          </div>

          <div>
            <Label className="text-base font-medium">用例详述</Label>
            <div className="space-y-4 mt-2">
              {srsData.useCaseDetails.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>字段</Label>
                    <Input
                      value={detail.field}
                      onChange={(e) => updateTableRow('useCaseDetails', index, 'field', e.target.value)}
                      placeholder="用例编号"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>内容</Label>
                    <Textarea
                      value={detail.content}
                      onChange={(e) => updateTableRow('useCaseDetails', index, 'content', e.target.value)}
                      placeholder="UC01"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">用户故事</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('userStories', { role: "", story: "", value: "" })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {srsData.userStories.map((story, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">用户故事 {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('userStories', index)}
                      disabled={srsData.userStories.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>角色</Label>
                      <Input
                        value={story.role}
                        onChange={(e) => updateTableRow('userStories', index, 'role', e.target.value)}
                        placeholder="买家"
                      />
                    </div>
                    <div>
                      <Label>故事</Label>
                      <Input
                        value={story.story}
                        onChange={(e) => updateTableRow('userStories', index, 'story', e.target.value)}
                        placeholder="作为买家，我想一次性删除已取消订单"
                      />
                    </div>
                    <div>
                      <Label>价值</Label>
                      <Input
                        value={story.value}
                        onChange={(e) => updateTableRow('userStories', index, 'value', e.target.value)}
                        placeholder="提升操作效率，降低客服投诉"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Non-functional Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            非功能需求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>非功能需求列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('nonFunctionalReqs', { dimension: "", indicator: "", requirement: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {srsData.nonFunctionalReqs.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">非功能需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('nonFunctionalReqs', index)}
                    disabled={srsData.nonFunctionalReqs.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>维度</Label>
                    <Select
                      value={req.dimension}
                      onValueChange={updateTableRow.bind(null, 'nonFunctionalReqs', index, 'dimension')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择维度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="性能">性能</SelectItem>
                        <SelectItem value="可用性">可用性</SelectItem>
                        <SelectItem value="安全">安全</SelectItem>
                        <SelectItem value="兼容性">兼容性</SelectItem>
                        <SelectItem value="可维护性">可维护性</SelectItem>
                        <SelectItem value="可扩展性">可扩展性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>指标</Label>
                    <Input
                      value={req.indicator}
                      onChange={(e) => updateTableRow('nonFunctionalReqs', index, 'indicator', e.target.value)}
                      placeholder="接口 P99 ≤ 500 ms；支持 1k QPS"
                    />
                  </div>
                  <div>
                                          <Label>需求描述</Label>
                    <Input
                      value={req.requirement}
onChange={(e) => updateTableRow('nonFunctionalReqs', index, 'requirement', e.target.value)}
                                              placeholder="具体的需求描述"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">7</Badge>
            数据需求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>数据需求列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('dataRequirements', { dataItem: "", type: "", source: "", usage: "", retention: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {srsData.dataRequirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">数据需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('dataRequirements', index)}
                    disabled={srsData.dataRequirements.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <Label>数据项</Label>
                    <Input
                      value={req.dataItem}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'dataItem', e.target.value)}
                      placeholder="订单 ID"
                    />
                  </div>
                  <div>
                    <Label>类型</Label>
                    <Input
                      value={req.type}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'type', e.target.value)}
                      placeholder="BIGINT"
                    />
                  </div>
                  <div>
                    <Label>来源</Label>
                    <Input
                      value={req.source}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'source', e.target.value)}
                      placeholder="业务表"
                    />
                  </div>
                  <div>
                    <Label>用途</Label>
                    <Input
                      value={req.usage}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'usage', e.target.value)}
                      placeholder="删除范围标识"
                    />
                  </div>
                  <div>
                    <Label>存储期限</Label>
                    <Input
                      value={req.retention}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'retention', e.target.value)}
                      placeholder="永久"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interface Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
            接口规范
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>接口规范列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('interfaceSpecs', { endpoint: "", method: "", request: "", response: "", errorCode: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {srsData.interfaceSpecs.map((spec, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">接口 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('interfaceSpecs', index)}
                    disabled={srsData.interfaceSpecs.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>端点</Label>
                    <Input
                      value={spec.endpoint}
                      onChange={(e) => updateTableRow('interfaceSpecs', index, 'endpoint', e.target.value)}
                      placeholder="/orders/batchDelete"
                    />
                  </div>
                  <div>
                    <Label>方法</Label>
                    <Select
                      value={spec.method}
                      onValueChange={updateTableRow.bind(null, 'interfaceSpecs', index, 'method')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择方法" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>请求示例</Label>
                    <Input
                      value={spec.request}
                      onChange={(e) => updateTableRow('interfaceSpecs', index, 'request', e.target.value)}
                      placeholder={'{"ids":[1,2,3]}'}
                    />
                  </div>
                  <div>
                    <Label>响应示例</Label>
                    <Input
                      value={spec.response}
                      onChange={(e) => updateTableRow('interfaceSpecs', index, 'response', e.target.value)}
                      placeholder={'{"success":[1,2],"fail":[3]}'}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>错误码</Label>
                    <Input
                      value={spec.errorCode}
                      onChange={(e) => updateTableRow('interfaceSpecs', index, 'errorCode', e.target.value)}
                      placeholder="4001 参数空，5001 系统错误"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acceptance Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">9</Badge>
            验收标准（DoD）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>验收标准列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('acceptanceCriteria', '')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {srsData.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={criteria}
                  onChange={(e) => updateArrayItem('acceptanceCriteria', index, e.target.value)}
                  placeholder="功能：选择 0/1/50/100 条均可正确删除"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('acceptanceCriteria', index)}
                  disabled={srsData.acceptanceCriteria.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks & Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            风险与假设
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>风险与假设列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('risksAssumptions', { risk: "", probability: "", impact: "", mitigation: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {srsData.risksAssumptions.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">风险 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('risksAssumptions', index)}
                    disabled={srsData.risksAssumptions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>风险</Label>
                    <Input
                      value={risk.risk}
                      onChange={(e) => updateTableRow('risksAssumptions', index, 'risk', e.target.value)}
                      placeholder="大批量删除导致慢查询"
                    />
                  </div>
                  <div>
                    <Label>等级</Label>
                    <Select
                      value={risk.level}
                      onValueChange={updateTableRow.bind(null, 'risksAssumptions', index, 'level')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择等级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="低">低</SelectItem>
                        <SelectItem value="中">中</SelectItem>
                        <SelectItem value="高">高</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>缓解措施</Label>
                    <Input
                      value={risk.mitigation}
                      onChange={(e) => updateTableRow('risksAssumptions', index, 'mitigation', e.target.value)}
                      placeholder="限制 100 条 + 异步任务"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appendix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">11</Badge>
            附录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>附录列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('appendix', '')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {srsData.appendix.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('appendix', index, e.target.value)}
                  placeholder="A. 竞品功能对比表"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('appendix', index)}
                  disabled={srsData.appendix.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
