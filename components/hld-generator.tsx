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

interface HLDData {
  // Header info
  systemName: string
  version: string
  author: string
  reviewDate: string
  status: string
  
  // Background & Goals
  businessBackground: string
  businessGoal: string
  currentScope: string
  
  // Architecture
  architectureDiagram: string
  
  // Core modules
  coreModules: TableRow[]
  
  // API design
  apiList: TableRow[]
  
  // Database design
  databaseTables: TableRow[]
  
  // Technology stack
  techStack: TableRow[]
  
  // Deployment architecture
  deploymentDesc: string
  
  // Performance requirements
  performanceReqs: TableRow[]
  
  // Security design
  securityMeasures: string[]
  
  // Monitoring & alerts
  monitoringItems: TableRow[]
  
  // Risk assessment
  risks: TableRow[]
  
  // Development plan
  developmentPlan: TableRow[]
}

interface HLDGeneratorProps {
  initialData?: HLDData | null
  onDataChange?: (data: HLDData) => void
}

const defaultHLDData: HLDData = {
  systemName: "",
  version: "v1.0",
  author: "",
  reviewDate: "",
  status: "草稿",
  businessBackground: "",
  businessGoal: "",
  currentScope: "",
  architectureDiagram: "",
  coreModules: [{ name: "", responsibility: "", technology: "", interface: "" }],
  apiList: [{ endpoint: "", method: "", description: "", request: "", response: "" }],
  databaseTables: [{ tableName: "", description: "", keyFields: "", indexes: "" }],
  techStack: [{ category: "", technology: "", version: "", reason: "" }],
  deploymentDesc: "",
  performanceReqs: [{ metric: "", target: "", measurement: "" }],
  securityMeasures: [""],
  monitoringItems: [{ item: "", metric: "", threshold: "", action: "" }],
  risks: [{ risk: "", probability: "", impact: "", mitigation: "" }],
  developmentPlan: [{ phase: "", duration: "", deliverable: "", owner: "" }]
}

export function HLDGenerator({ initialData, onDataChange }: HLDGeneratorProps) {
  const [hldData, setHLDData] = useState<HLDData>(initialData || defaultHLDData)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setHLDData(initialData)
    } else {
      setHLDData(defaultHLDData)
    }
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    if (onDataChange) {
      onDataChange(hldData)
    }
  }, [hldData]) // 移除onDataChange依赖，避免无限循环

  const updateField = (field: keyof HLDData, value: any) => {
    setHLDData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof HLDData, defaultValue: any) => {
    setHLDData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: keyof HLDData, index: number) => {
    setHLDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof HLDData, index: number, value: any) => {
    setHLDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }))
  }

  const updateTableRow = (field: keyof HLDData, index: number, key: string, value: string) => {
    setHLDData(prev => ({
      ...prev,
      [field]: (prev[field] as TableRow[]).map((row, i) => 
        i === index ? { ...row, [key]: value } : row
      )
    }))
  }

  const generateMarkdown = () => {
    const md = `# 概要设计说明书（HLD）

> **系统名称**：${hldData.systemName}  
> **版本**：${hldData.version}  
> **作者**：${hldData.author}  
> **评审日期**：${hldData.reviewDate}  
> **当前状态**：${hldData.status}

---

## 1. 背景与目标

- **业务背景**：${hldData.businessBackground}
- **业务目标**：${hldData.businessGoal}
- **本期范围**：${hldData.currentScope}

---

## 2. 整体架构图

${hldData.architectureDiagram}

---

## 3. 核心模块设计

| 模块名称 | 职责描述 | 技术选型 | 接口说明 |
|---|---|---|---|
${hldData.coreModules.map(module => `| ${module.name} | ${module.responsibility} | ${module.technology} | ${module.interface} |`).join('\n')}

---

## 4. API 设计

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---|---|---|---|---|
${hldData.apiList.map(api => `| ${api.endpoint} | ${api.method} | ${api.description} | ${api.request} | ${api.response} |`).join('\n')}

---

## 5. 数据库设计

| 表名 | 功能描述 | 关键字段 | 索引设计 |
|---|---|---|---|
${hldData.databaseTables.map(table => `| ${table.tableName} | ${table.description} | ${table.keyFields} | ${table.indexes} |`).join('\n')}

---

## 6. 技术栈选型

| 技术分类 | 技术选型 | 版本要求 | 选型理由 |
|---|---|---|---|
${hldData.techStack.map(tech => `| ${tech.category} | ${tech.technology} | ${tech.version} | ${tech.reason} |`).join('\n')}

---

## 7. 部署架构

${hldData.deploymentDesc}

---

## 8. 性能指标

| 性能指标 | 目标值 | 测量方法 |
|---|---|---|
${hldData.performanceReqs.map(perf => `| ${perf.metric} | ${perf.target} | ${perf.measurement} |`).join('\n')}

---

## 9. 安全设计

${hldData.securityMeasures.filter(item => item.trim()).map(item => `- ${item}`).join('\n')}

---

## 10. 监控告警

| 监控项 | 监控指标 | 告警阈值 | 处理动作 |
|---|---|---|---|
${hldData.monitoringItems.map(item => `| ${item.item} | ${item.metric} | ${item.threshold} | ${item.action} |`).join('\n')}

---

## 11. 风险评估

| 风险项 | 发生概率 | 影响程度 | 应对措施 |
|---|---|---|---|
${hldData.risks.map(risk => `| ${risk.risk} | ${risk.probability} | ${risk.impact} | ${risk.mitigation} |`).join('\n')}

---

## 12. 开发计划

| 开发阶段 | 预计工期 | 交付物 | 负责人 |
|---|---|---|---|
${hldData.developmentPlan.map(plan => `| ${plan.phase} | ${plan.duration} | ${plan.deliverable} | ${plan.owner} |`).join('\n')}

---

### 附录

- **相关文档**：PRD、详细设计文档
- **技术调研**：技术选型调研报告
- **性能测试**：压测报告和性能基准

> **评审要点**：  
> 1. 架构设计是否满足业务需求和性能指标  
> 2. 技术选型是否合理，是否考虑了扩展性和维护性  
> 3. 安全设计是否完备，是否符合公司安全规范  
> 4. 监控告警是否覆盖关键指标，是否便于故障定位`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${hldData.systemName || 'HLD'}_${hldData.version}.md`
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
          <h1 className="text-2xl font-bold text-gray-900">HLD 概要设计说明书</h1>
          <p className="text-gray-600 mt-1">填写系统概要设计文档的各个部分，完成后可导出为 Markdown 文件</p>
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
                value={hldData.systemName}
                onChange={(e) => updateField('systemName', e.target.value)}
                placeholder="系统/模块名称"
              />
            </div>
            <div>
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={hldData.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                value={hldData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="架构师/技术负责人"
              />
            </div>
            <div>
              <Label htmlFor="reviewDate">评审日期</Label>
              <Input
                id="reviewDate"
                type="date"
                value={hldData.reviewDate}
                onChange={(e) => updateField('reviewDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">当前状态</Label>
              <Select value={hldData.status} onValueChange={updateField.bind(null, 'status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="评审中">评审中</SelectItem>
                  <SelectItem value="已评审">已评审</SelectItem>
                  <SelectItem value="已冻结">已冻结</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background & Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            背景与目标
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessBackground">业务背景</Label>
            <Textarea
              id="businessBackground"
              value={hldData.businessBackground}
              onChange={(e) => updateField('businessBackground', e.target.value)}
              placeholder="一句话说明需求来源（对应 PRD #ID）"
            />
          </div>
          <div>
            <Label htmlFor="businessGoal">业务目标</Label>
            <Textarea
              id="businessGoal"
              value={hldData.businessGoal}
              onChange={(e) => updateField('businessGoal', e.target.value)}
              placeholder={'一句话量化指标（如"支撑 10w QPS 查询"）'}
            />
          </div>
          <div>
            <Label htmlFor="currentScope">本期范围</Label>
            <Textarea
              id="currentScope"
              value={hldData.currentScope}
              onChange={(e) => updateField('currentScope', e.target.value)}
              placeholder="只做 A / B / C；二期再做 X / Y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Architecture Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            整体架构图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="architectureDiagram">架构图描述</Label>
            <Textarea
              id="architectureDiagram"
              value={hldData.architectureDiagram}
              onChange={(e) => updateField('architectureDiagram', e.target.value)}
              placeholder="可以添加 Mermaid 图表代码或架构图描述"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Core Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            核心模块设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>核心模块列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('coreModules', { name: '', responsibility: '', technology: '', interface: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.coreModules.map((module, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">模块 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('coreModules', index)}
                    disabled={hldData.coreModules.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>模块名称</Label>
                    <Input
                      value={module.name}
                      onChange={(e) => updateTableRow('coreModules', index, 'name', e.target.value)}
                      placeholder="用户服务"
                    />
                  </div>
                  <div>
                    <Label>技术选型</Label>
                    <Input
                      value={module.technology}
                      onChange={(e) => updateTableRow('coreModules', index, 'technology', e.target.value)}
                      placeholder="Spring Boot + MySQL"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>职责描述</Label>
                    <Input
                      value={module.responsibility}
                      onChange={(e) => updateTableRow('coreModules', index, 'responsibility', e.target.value)}
                      placeholder="负责用户注册、登录、权限管理等功能"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>接口说明</Label>
                    <Input
                      value={module.interface}
                      onChange={(e) => updateTableRow('coreModules', index, 'interface', e.target.value)}
                      placeholder="提供 REST API，支持用户 CRUD 操作"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            API 设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>API 接口列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('apiList', { endpoint: '', method: '', description: '', request: '', response: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.apiList.map((api, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('apiList', index)}
                    disabled={hldData.apiList.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>接口路径</Label>
                    <Input
                      value={api.endpoint}
                      onChange={(e) => updateTableRow('apiList', index, 'endpoint', e.target.value)}
                      placeholder="/api/v1/users"
                    />
                  </div>
                  <div>
                    <Label>请求方法</Label>
                    <Select
                      value={api.method}
                      onValueChange={updateTableRow.bind(null, 'apiList', index, 'method')}
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
                  <div className="md:col-span-2">
                    <Label>功能描述</Label>
                    <Input
                      value={api.description}
                      onChange={(e) => updateTableRow('apiList', index, 'description', e.target.value)}
                      placeholder="获取用户列表"
                    />
                  </div>
                  <div>
                    <Label>请求参数</Label>
                    <Input
                      value={api.request}
                      onChange={(e) => updateTableRow('apiList', index, 'request', e.target.value)}
                      placeholder={'{"page": 1, "size": 10}'}
                    />
                  </div>
                  <div>
                    <Label>响应格式</Label>
                    <Input
                      value={api.response}
                      onChange={(e) => updateTableRow('apiList', index, 'response', e.target.value)}
                      placeholder={'{"code": 200, "data": [...]}'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            数据库设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>数据表设计</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('databaseTables', { tableName: '', description: '', keyFields: '', indexes: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.databaseTables.map((table, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">数据表 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('databaseTables', index)}
                    disabled={hldData.databaseTables.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>表名</Label>
                    <Input
                      value={table.tableName}
                      onChange={(e) => updateTableRow('databaseTables', index, 'tableName', e.target.value)}
                      placeholder="t_user"
                    />
                  </div>
                  <div>
                    <Label>功能描述</Label>
                    <Input
                      value={table.description}
                      onChange={(e) => updateTableRow('databaseTables', index, 'description', e.target.value)}
                      placeholder="用户基础信息表"
                    />
                  </div>
                  <div>
                    <Label>关键字段</Label>
                    <Input
                      value={table.keyFields}
                      onChange={(e) => updateTableRow('databaseTables', index, 'keyFields', e.target.value)}
                      placeholder="id, username, email, created_at"
                    />
                  </div>
                  <div>
                    <Label>索引设计</Label>
                    <Input
                      value={table.indexes}
                      onChange={(e) => updateTableRow('databaseTables', index, 'indexes', e.target.value)}
                      placeholder="PRIMARY KEY(id), UNIQUE(username), INDEX(email)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">7</Badge>
            技术栈选型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>技术选型列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('techStack', { category: '', technology: '', version: '', reason: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.techStack.map((tech, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">技术选型 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('techStack', index)}
                    disabled={hldData.techStack.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>技术分类</Label>
                    <Select
                      value={tech.category}
                      onValueChange={updateTableRow.bind(null, 'techStack', index, 'category')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="后端框架">后端框架</SelectItem>
                        <SelectItem value="前端框架">前端框架</SelectItem>
                        <SelectItem value="数据库">数据库</SelectItem>
                        <SelectItem value="缓存">缓存</SelectItem>
                        <SelectItem value="消息队列">消息队列</SelectItem>
                        <SelectItem value="监控">监控</SelectItem>
                        <SelectItem value="部署">部署</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>技术选型</Label>
                    <Input
                      value={tech.technology}
                      onChange={(e) => updateTableRow('techStack', index, 'technology', e.target.value)}
                      placeholder="Spring Boot"
                    />
                  </div>
                  <div>
                    <Label>版本要求</Label>
                    <Input
                      value={tech.version}
                      onChange={(e) => updateTableRow('techStack', index, 'version', e.target.value)}
                      placeholder="2.7.x"
                    />
                  </div>
                  <div>
                    <Label>选型理由</Label>
                    <Input
                      value={tech.reason}
                      onChange={(e) => updateTableRow('techStack', index, 'reason', e.target.value)}
                      placeholder="成熟稳定，社区活跃，团队熟悉"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
            部署架构
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="deploymentDesc">部署架构描述</Label>
            <Textarea
              id="deploymentDesc"
              value={hldData.deploymentDesc}
              onChange={(e) => updateField('deploymentDesc', e.target.value)}
              placeholder="描述系统的部署架构，包括服务器配置、网络拓扑、负载均衡等"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">9</Badge>
            性能指标
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>性能指标列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('performanceReqs', { metric: '', target: '', measurement: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.performanceReqs.map((perf, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">性能指标 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('performanceReqs', index)}
                    disabled={hldData.performanceReqs.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>性能指标</Label>
                    <Input
                      value={perf.metric}
                      onChange={(e) => updateTableRow('performanceReqs', index, 'metric', e.target.value)}
                      placeholder="QPS"
                    />
                  </div>
                  <div>
                    <Label>目标值</Label>
                    <Input
                      value={perf.target}
                      onChange={(e) => updateTableRow('performanceReqs', index, 'target', e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label>测量方法</Label>
                    <Input
                      value={perf.measurement}
                      onChange={(e) => updateTableRow('performanceReqs', index, 'measurement', e.target.value)}
                      placeholder="JMeter 压测"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            安全设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>安全措施列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('securityMeasures', '')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {hldData.securityMeasures.map((measure, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={measure}
                  onChange={(e) => updateArrayItem('securityMeasures', index, e.target.value)}
                  placeholder="JWT 身份认证"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('securityMeasures', index)}
                  disabled={hldData.securityMeasures.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monitoring & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">11</Badge>
            监控告警
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>监控项列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('monitoringItems', { item: '', metric: '', threshold: '', action: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.monitoringItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">监控项 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('monitoringItems', index)}
                    disabled={hldData.monitoringItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>监控项</Label>
                    <Input
                      value={item.item}
                      onChange={(e) => updateTableRow('monitoringItems', index, 'item', e.target.value)}
                      placeholder="CPU 使用率"
                    />
                  </div>
                  <div>
                    <Label>监控指标</Label>
                    <Input
                      value={item.metric}
                      onChange={(e) => updateTableRow('monitoringItems', index, 'metric', e.target.value)}
                      placeholder="cpu_usage_percent"
                    />
                  </div>
                  <div>
                    <Label>告警阈值</Label>
                    <Input
                      value={item.threshold}
                      onChange={(e) => updateTableRow('monitoringItems', index, 'threshold', e.target.value)}
                      placeholder={"> 80%"}
                    />
                  </div>
                  <div>
                    <Label>处理动作</Label>
                    <Input
                      value={item.action}
                      onChange={(e) => updateTableRow('monitoringItems', index, 'action', e.target.value)}
                      placeholder="发送钉钉告警，自动扩容"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">12</Badge>
            风险评估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>风险项列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('risks', { risk: '', probability: '', impact: '', mitigation: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.risks.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">风险项 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('risks', index)}
                    disabled={hldData.risks.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>风险项</Label>
                    <Input
                      value={risk.risk}
                      onChange={(e) => updateTableRow('risks', index, 'risk', e.target.value)}
                      placeholder="数据库性能瓶颈"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>发生概率</Label>
                      <Select
                        value={risk.probability}
                        onValueChange={updateTableRow.bind(null, 'risks', index, 'probability')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择概率" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="低">低</SelectItem>
                          <SelectItem value="中">中</SelectItem>
                          <SelectItem value="高">高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>影响程度</Label>
                      <Select
                        value={risk.impact}
                        onValueChange={updateTableRow.bind(null, 'risks', index, 'impact')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择影响" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="低">低</SelectItem>
                          <SelectItem value="中">中</SelectItem>
                          <SelectItem value="高">高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>应对措施</Label>
                      <Input
                        value={risk.mitigation}
                        onChange={(e) => updateTableRow('risks', index, 'mitigation', e.target.value)}
                        placeholder="读写分离，分库分表"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">13</Badge>
            开发计划
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>开发阶段列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('developmentPlan', { phase: '', duration: '', deliverable: '', owner: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {hldData.developmentPlan.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">开发阶段 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('developmentPlan', index)}
                    disabled={hldData.developmentPlan.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>开发阶段</Label>
                    <Input
                      value={plan.phase}
                      onChange={(e) => updateTableRow('developmentPlan', index, 'phase', e.target.value)}
                      placeholder="详细设计阶段"
                    />
                  </div>
                  <div>
                    <Label>预计工期</Label>
                    <Input
                      value={plan.duration}
                      onChange={(e) => updateTableRow('developmentPlan', index, 'duration', e.target.value)}
                      placeholder="2 周"
                    />
                  </div>
                  <div>
                    <Label>交付物</Label>
                    <Input
                      value={plan.deliverable}
                      onChange={(e) => updateTableRow('developmentPlan', index, 'deliverable', e.target.value)}
                      placeholder="详细设计文档"
                    />
                  </div>
                  <div>
                    <Label>负责人</Label>
                    <Input
                      value={plan.owner}
                      onChange={(e) => updateTableRow('developmentPlan', index, 'owner', e.target.value)}
                      placeholder="架构师"
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
