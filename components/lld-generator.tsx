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

interface LLDData {
  // Header info
  moduleName: string
  version: string
  author: string
  date: string
  filePath: string
  
  // Requirements traceability
  requirements: TableRow[]
  
  // Design scope
  currentScope: string
  
  // Class/Interface/Method design
  classDiagram: string
  interfaceList: TableRow[]
  
  // Data layer design
  tableChanges: string
  indexDesign: TableRow[]
  
  // Key method pseudocode
  keyMethods: TableRow[]
  
  // Non-functional implementation
  nonFunctionalImpl: TableRow[]
  
  // Exception handling
  exceptionMatrix: TableRow[]
  

  
  // Deployment & configuration
  deploymentConfig: string
  
  // Change log
  changeLog: TableRow[]
}

interface LLDGeneratorProps {
  initialData?: LLDData | null
  onDataChange?: (data: LLDData) => void
}

const defaultLLDData: LLDData = {
  moduleName: "",
  version: "v1.0",
  author: "",
  date: new Date().toISOString().split('T')[0],
  filePath: "",
  requirements: [{ id: "", description: "", source: "" }],
  currentScope: "",
  classDiagram: "",
  interfaceList: [{ interface: "", signature: "", logic: "" }],
  tableChanges: "",
  indexDesign: [{ indexName: "", fields: "", type: "", reason: "" }],
  keyMethods: [{ methodName: "", signature: "", pseudocode: "" }],
  nonFunctionalImpl: [{ dimension: "", implementation: "" }],
  exceptionMatrix: [{ scenario: "", errorCode: "", userMessage: "", compensation: "" }],

  deploymentConfig: "",
  changeLog: [{ version: "", date: "", author: "", changes: "" }]
}

export function LLDGenerator({ initialData, onDataChange }: LLDGeneratorProps) {
  const [lldData, setLLDData] = useState<LLDData>(initialData || defaultLLDData)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setLLDData(initialData)
    } else {
      setLLDData(defaultLLDData)
    }
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    if (onDataChange) {
      onDataChange(lldData)
    }
  }, [lldData]) // 移除onDataChange依赖，避免无限循环

  const updateField = (field: keyof LLDData, value: any) => {
    setLLDData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof LLDData, defaultValue: any) => {
    setLLDData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: keyof LLDData, index: number) => {
    setLLDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof LLDData, index: number, value: any) => {
    setLLDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }))
  }

  const updateTableRow = (field: keyof LLDData, index: number, key: string, value: string) => {
    setLLDData(prev => ({
      ...prev,
      [field]: (prev[field] as TableRow[]).map((row, i) => 
        i === index ? { ...row, [key]: value } : row
      )
    }))
  }

  const generateMarkdown = () => {
    const md = `<!-- =====================================================
详细设计说明书（LLD）
模块：${lldData.moduleName}
版本：${lldData.version}
作者：${lldData.author}
日期：${lldData.date}
存放：${lldData.filePath}
===================================================== -->

# 1. 需求追溯

| 编号 | 描述 | 来源 |
|---|---|---|
${lldData.requirements.map(req => `| ${req.id} | ${req.description} | ${req.source} |`).join('\n')}

# 2. 设计范围

- **本期**：${lldData.currentScope}

# 3. 类/接口/方法级设计

## 3.1 类图

${lldData.classDiagram}

## 3.2 接口清单

| 接口 | 方法签名 | 主要逻辑 |
|---|---|---|
${lldData.interfaceList.map(item => `| ${item.interface} | ${item.signature} | ${item.logic} |`).join('\n')}

# 4. 数据层设计

## 4.1 表结构（本次变更）

${lldData.tableChanges}

## 4.2 索引设计

| 索引名 | 字段 | 类型 | 原因 |
|---|---|---|---|
${lldData.indexDesign.map(index => `| ${index.indexName} | ${index.fields} | ${index.type} | ${index.reason} |`).join('\n')}

# 5. 关键方法伪代码

${lldData.keyMethods.map(method => `## ${method.methodName}

\`\`\`java
${method.signature}
${method.pseudocode}
\`\`\``).join('\n\n')}

# 6. 非功能实现

| 维度 | 实现 |
|---|---|
${lldData.nonFunctionalImpl.map(item => `| **${item.dimension}** | ${item.implementation} |`).join('\n')}

# 7. 异常处理矩阵

| 场景 | 错误码 | 前端提示 | 内部补偿 |
|---|---|---|---|
${lldData.exceptionMatrix.map(item => `| ${item.scenario} | ${item.errorCode} | ${item.userMessage} | ${item.compensation} |`).join('\n')}

# 8. 部署 & 配置

${lldData.deploymentConfig}

# 9. 变更记录

| 版本 | 日期 | 作者 | 变更要点 |
|---|---|---|---|
${lldData.changeLog.map(log => `| ${log.version} | ${log.date} | ${log.author} | ${log.changes} |`).join('\n')}`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lld-${lldData.moduleName || 'module'}-${lldData.version}.md`
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
          <h1 className="text-2xl font-bold text-gray-900">LLD 详细设计说明书</h1>
          <p className="text-gray-600 mt-1">填写模块详细设计文档的各个部分，完成后可导出为 Markdown 文件</p>
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
              <Label htmlFor="moduleName">模块名称</Label>
              <Input
                id="moduleName"
                value={lldData.moduleName}
                onChange={(e) => updateField('moduleName', e.target.value)}
                placeholder="order-batch-delete"
              />
            </div>
            <div>
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={lldData.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                value={lldData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="后端-李四"
              />
            </div>
            <div>
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={lldData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="filePath">文档存放路径</Label>
              <Input
                id="filePath"
                value={lldData.filePath}
                onChange={(e) => updateField('filePath', e.target.value)}
                placeholder="docs/design/lld-order-batch-delete-v1.0.md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Traceability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            需求追溯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>需求列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('requirements', { id: '', description: '', source: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lldData.requirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('requirements', index)}
                    disabled={lldData.requirements.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>编号</Label>
                    <Input
                      value={req.id}
                      onChange={(e) => updateTableRow('requirements', index, 'id', e.target.value)}
                      placeholder="R-2025-08-06-01"
                    />
                  </div>
                  <div>
                    <Label>来源</Label>
                    <Input
                      value={req.source}
                      onChange={(e) => updateTableRow('requirements', index, 'source', e.target.value)}
                      placeholder="PRD §3.2"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label>描述</Label>
                    <Input
                      value={req.description}
                      onChange={(e) => updateTableRow('requirements', index, 'description', e.target.value)}
                      placeholder={'支持用户批量删除订单（≤100条）'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            设计范围
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="currentScope">本期范围</Label>
            <Textarea
              id="currentScope"
              value={lldData.currentScope}
              onChange={(e) => updateField('currentScope', e.target.value)}
              placeholder="仅实现同步批量删除；归档与恢复不在本文档范围"
            />
          </div>
        </CardContent>
      </Card>

      {/* Class/Interface/Method Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            类/接口/方法级设计
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="classDiagram">类图</Label>
            <Textarea
              id="classDiagram"
              value={lldData.classDiagram}
              onChange={(e) => updateField('classDiagram', e.target.value)}
              placeholder="可以添加 Mermaid 类图代码"
              rows={6}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>接口清单</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('interfaceList', { interface: '', signature: '', logic: '' })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {lldData.interfaceList.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">接口 {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('interfaceList', index)}
                      disabled={lldData.interfaceList.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>接口</Label>
                      <Input
                        value={item.interface}
                        onChange={(e) => updateTableRow('interfaceList', index, 'interface', e.target.value)}
                        placeholder="OrderDeleteFacade#deleteBatch"
                      />
                    </div>
                    <div>
                      <Label>方法签名</Label>
                      <Input
                        value={item.signature}
                        onChange={(e) => updateTableRow('interfaceList', index, 'signature', e.target.value)}
                        placeholder="BatchDeleteResult deleteBatch(BatchDeleteCmd cmd)"
                      />
                    </div>
                    <div>
                      <Label>主要逻辑</Label>
                      <Input
                        value={item.logic}
                        onChange={(e) => updateTableRow('interfaceList', index, 'logic', e.target.value)}
                        placeholder="参数校验 → 防重 → 业务校验 → 软删除 → 返回结果"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Layer Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            数据层设计
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="tableChanges">表结构变更</Label>
            <Textarea
              id="tableChanges"
              value={lldData.tableChanges}
              onChange={(e) => updateField('tableChanges', e.target.value)}
              placeholder="```sql&#10;ALTER TABLE t_order&#10;    ADD COLUMN deleted_at DATETIME DEFAULT NULL COMMENT '软删除时间';&#10;```"
              rows={6}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>索引设计</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('indexDesign', { indexName: '', fields: '', type: '', reason: '' })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {lldData.indexDesign.map((index, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">索引 {idx + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('indexDesign', idx)}
                      disabled={lldData.indexDesign.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>索引名</Label>
                      <Input
                        value={index.indexName}
                        onChange={(e) => updateTableRow('indexDesign', idx, 'indexName', e.target.value)}
                        placeholder="idx_user_status_deleted"
                      />
                    </div>
                    <div>
                      <Label>字段</Label>
                      <Input
                        value={index.fields}
                        onChange={(e) => updateTableRow('indexDesign', idx, 'fields', e.target.value)}
                        placeholder="(user_id, status, deleted_at)"
                      />
                    </div>
                    <div>
                      <Label>类型</Label>
                      <Select
                        value={index.type}
                        onValueChange={updateTableRow.bind(null, 'indexDesign', idx, 'type')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="联合">联合</SelectItem>
                          <SelectItem value="唯一">唯一</SelectItem>
                          <SelectItem value="普通">普通</SelectItem>
                          <SelectItem value="全文">全文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>原因</Label>
                      <Input
                        value={index.reason}
                        onChange={(e) => updateTableRow('indexDesign', idx, 'reason', e.target.value)}
                        placeholder="覆盖查询 & 排序"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Method Pseudocode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            关键方法伪代码
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>关键方法列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('keyMethods', { methodName: '', signature: '', pseudocode: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lldData.keyMethods.map((method, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">方法 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('keyMethods', index)}
                    disabled={lldData.keyMethods.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>方法名</Label>
                    <Input
                      value={method.methodName}
                      onChange={(e) => updateTableRow('keyMethods', index, 'methodName', e.target.value)}
                      placeholder="delete"
                    />
                  </div>
                  <div>
                    <Label>方法签名</Label>
                    <Input
                      value={method.signature}
                      onChange={(e) => updateTableRow('keyMethods', index, 'signature', e.target.value)}
                      placeholder="public DeleteReport delete(List<Long> ids, Long userId)"
                    />
                  </div>
                  <div>
                    <Label>伪代码</Label>
                    <Textarea
                      value={method.pseudocode}
                      onChange={(e) => updateTableRow('keyMethods', index, 'pseudocode', e.target.value)}
                      placeholder="@Transactional(rollbackFor = Exception.class)&#10;public DeleteReport delete(List<Long> ids, Long userId) {&#10;    // 实现逻辑&#10;}"
                      rows={8}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Non-functional Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">7</Badge>
            非功能实现
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>非功能实现列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('nonFunctionalImpl', { dimension: '', implementation: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lldData.nonFunctionalImpl.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">实现 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('nonFunctionalImpl', index)}
                    disabled={lldData.nonFunctionalImpl.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>维度</Label>
                    <Select
                      value={item.dimension}
                      onValueChange={updateTableRow.bind(null, 'nonFunctionalImpl', index, 'dimension')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择维度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="幂等">幂等</SelectItem>
                        <SelectItem value="性能">性能</SelectItem>
                        <SelectItem value="监控">监控</SelectItem>
                        <SelectItem value="日志">日志</SelectItem>
                        <SelectItem value="安全">安全</SelectItem>
                        <SelectItem value="缓存">缓存</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>实现</Label>
                    <Input
                      value={item.implementation}
                      onChange={(e) => updateTableRow('nonFunctionalImpl', index, 'implementation', e.target.value)}
                      placeholder={'Redis `SETNX key=user:{userId}:delete value=ids expire=300s`'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exception Handling Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
            异常处理矩阵
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>异常处理列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('exceptionMatrix', { scenario: '', errorCode: '', userMessage: '', compensation: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lldData.exceptionMatrix.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">异常 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('exceptionMatrix', index)}
                    disabled={lldData.exceptionMatrix.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>场景</Label>
                    <Input
                      value={item.scenario}
                      onChange={(e) => updateTableRow('exceptionMatrix', index, 'scenario', e.target.value)}
                      placeholder="订单状态非法"
                    />
                  </div>
                  <div>
                    <Label>错误码</Label>
                    <Input
                      value={item.errorCode}
                      onChange={(e) => updateTableRow('exceptionMatrix', index, 'errorCode', e.target.value)}
                      placeholder="4003"
                    />
                  </div>
                  <div>
                    <Label>前端提示</Label>
                    <Input
                      value={item.userMessage}
                      onChange={(e) => updateTableRow('exceptionMatrix', index, 'userMessage', e.target.value)}
                      placeholder="存在不可删除订单"
                    />
                  </div>
                  <div>
                    <Label>内部补偿</Label>
                    <Input
                      value={item.compensation}
                      onChange={(e) => updateTableRow('exceptionMatrix', index, 'compensation', e.target.value)}
                      placeholder="审计日志"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment & Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">9</Badge>
            部署 & 配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="deploymentConfig">部署配置</Label>
            <Textarea
              id="deploymentConfig"
              value={lldData.deploymentConfig}
              onChange={(e) => updateField('deploymentConfig', e.target.value)}
              placeholder="- **开关**：`feature.batchDelete.enabled`（Apollo）&#10;- **灰度**：白名单 `batch.delete.whiteList=userId1,userId2`"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            变更记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>变更记录列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('changeLog', { version: '', date: '', author: '', changes: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lldData.changeLog.map((log, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">变更记录 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('changeLog', index)}
                    disabled={lldData.changeLog.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>版本</Label>
                    <Input
                      value={log.version}
                      onChange={(e) => updateTableRow('changeLog', index, 'version', e.target.value)}
                      placeholder="v1.0"
                    />
                  </div>
                  <div>
                    <Label>日期</Label>
                    <Input
                      type="date"
                      value={log.date}
                      onChange={(e) => updateTableRow('changeLog', index, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>作者</Label>
                    <Input
                      value={log.author}
                      onChange={(e) => updateTableRow('changeLog', index, 'author', e.target.value)}
                      placeholder="李四"
                    />
                  </div>
                  <div>
                    <Label>变更要点</Label>
                    <Input
                      value={log.changes}
                      onChange={(e) => updateTableRow('changeLog', index, 'changes', e.target.value)}
                      placeholder="首版：同步删除 + 幂等锁"
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
