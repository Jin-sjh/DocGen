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

interface DBDDData {
  // Header info
  systemName: string
  moduleName: string
  version: string
  author: string
  date: string
  filePath: string
  
  // Document info
  documentInfo: TableRow[]
  
  // Version & change log
  changeLog: TableRow[]
  
  // ER diagram
  erDiagram: string
  
  // Data dictionary
  tables: TableRow[]
  tableFields: { [tableName: string]: TableRow[] }
  
  // Index design
  indexes: TableRow[]
  
  // Constraints & rules
  constraintsRules: string
  
  // Initialization script
  initScript: string
  
  // Capacity estimation
  capacityEstimation: TableRow[]
  
  // Security & permissions
  securityPermissions: string
  
  // Backup & recovery
  backupRecovery: string
  
  // Future extensions
  futureExtensions: string
}

interface DBDDGeneratorProps {
  initialData?: DBDDData | null
  onDataChange?: (data: DBDDData) => void
}

const defaultDBDDData: DBDDData = {
  systemName: "",
  moduleName: "",
  version: "v1.0",
  author: "",
  date: new Date().toISOString().split('T')[0],
  filePath: "",
  documentInfo: [
    { field: "系统/子系统", content: "" },
    { field: "数据库类型", content: "MySQL 8.0" },
    { field: "字符集", content: "utf8mb4" },
    { field: "排序规则", content: "utf8mb4_general_ci" },
    { field: "高可用方案", content: "" },
    { field: "备份策略", content: "" }
  ],
  changeLog: [{ version: "", date: "", author: "", changes: "" }],
  erDiagram: "",
  tables: [{ tableName: "", description: "", engine: "InnoDB" }],
  tableFields: {},
  indexes: [{ indexName: "", tableName: "", fields: "", type: "", note: "" }],
  constraintsRules: "",
  initScript: "",
  capacityEstimation: [{ tableName: "", initialRows: "", yearlyGrowth: "", avgRowSize: "", yearSpace: "" }],
  securityPermissions: "",
  backupRecovery: "",
  futureExtensions: ""
}

export function DBDDGenerator({ initialData, onDataChange }: DBDDGeneratorProps) {
  const [dbddData, setDBDDData] = useState<DBDDData>(initialData || defaultDBDDData)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setDBDDData(initialData)
    } else {
      setDBDDData(defaultDBDDData)
    }
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    if (onDataChange) {
      onDataChange(dbddData)
    }
  }, [dbddData]) // 移除onDataChange依赖，避免无限循环

  const updateField = (field: keyof DBDDData, value: any) => {
    setDBDDData(prev => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: keyof DBDDData, defaultValue: any) => {
    setDBDDData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }))
  }

  const removeArrayItem = (field: keyof DBDDData, index: number) => {
    setDBDDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof DBDDData, index: number, value: any) => {
    setDBDDData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }))
  }

  const updateTableRow = (field: keyof DBDDData, index: number, key: string, value: string) => {
    setDBDDData(prev => ({
      ...prev,
      [field]: (prev[field] as TableRow[]).map((row, i) => 
        i === index ? { ...row, [key]: value } : row
      )
    }))
  }

  const addTableField = (tableName: string) => {
    setDBDDData(prev => ({
      ...prev,
      tableFields: {
        ...prev.tableFields,
        [tableName]: [
          ...(prev.tableFields[tableName] || []),
          { fieldName: "", type: "", nullable: "否", defaultValue: "", description: "", index: "" }
        ]
      }
    }))
  }

  const removeTableField = (tableName: string, index: number) => {
    setDBDDData(prev => ({
      ...prev,
      tableFields: {
        ...prev.tableFields,
        [tableName]: (prev.tableFields[tableName] || []).filter((_, i) => i !== index)
      }
    }))
  }

  const updateTableField = (tableName: string, index: number, key: string, value: string) => {
    setDBDDData(prev => ({
      ...prev,
      tableFields: {
        ...prev.tableFields,
        [tableName]: (prev.tableFields[tableName] || []).map((field, i) => 
          i === index ? { ...field, [key]: value } : field
        )
      }
    }))
  }

  const generateMarkdown = () => {
    const md = `<!-- =====================================================
数据库设计文档（DBDD）
系统：${dbddData.systemName}
模块：${dbddData.moduleName}
版本：${dbddData.version}
作者：${dbddData.author}
日期：${dbddData.date}
存放：${dbddData.filePath}
===================================================== -->

# 1. 文档信息

| 字段 | 内容 |
|---|---|
${dbddData.documentInfo.map(info => `| ${info.field} | ${info.content} |`).join('\n')}

---

# 2. 版本与变更记录

| 版本 | 日期 | 作者 | 变更描述 |
|---|---|---|---|
${dbddData.changeLog.map(log => `| ${log.version} | ${log.date} | ${log.author} | ${log.changes} |`).join('\n')}

---

# 3. ER 图

${dbddData.erDiagram}

---

# 4. 数据字典

${dbddData.tables.map(table => {
  const fields = dbddData.tableFields[table.tableName] || []
  return `## 4.${dbddData.tables.indexOf(table) + 1} ${table.description} \`${table.tableName}\`

| 字段 | 类型 | 是否可空 | 默认值 | 描述 | 索引 |
|---|---|---|---|---|---|
${fields.map(field => `| \`${field.fieldName}\` | \`${field.type}\` | ${field.nullable} | ${field.defaultValue} | ${field.description} | ${field.index} |`).join('\n')}`
}).join('\n\n')}

---

# 5. 索引设计

| 索引名 | 表 | 字段 | 类型 | 备注 |
|---|---|---|---|---|
${dbddData.indexes.map(index => `| \`${index.indexName}\` | \`${index.tableName}\` | (${index.fields}) | ${index.type} | ${index.note} |`).join('\n')}

---

# 6. 约束 & 规则

${dbddData.constraintsRules}

---

# 7. 初始化脚本

\`\`\`sql
${dbddData.initScript}
\`\`\`

---

# 8. 容量预估

| 表 | 初始行数 | 年增长 | 平均行大小 | 1年空间 |
|---|---|---|---|---|
${dbddData.capacityEstimation.map(item => `| \`${item.tableName}\` | ${item.initialRows} | ${item.yearlyGrowth} | ${item.avgRowSize} | ${item.yearSpace} |`).join('\n')}

---

# 9. 安全与权限

${dbddData.securityPermissions}

---

# 10. 备份 & 恢复

${dbddData.backupRecovery}

---

# 11. 未来扩展点

${dbddData.futureExtensions}

---

> **评审签字**  
> DBA：_______  后端：_______  架构：_______  日期：_______`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dbdd-${dbddData.moduleName || 'module'}-${dbddData.version}.md`
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
          <h1 className="text-2xl font-bold text-gray-900">DBDD 数据库设计文档</h1>
          <p className="text-gray-600 mt-1">填写数据库设计文档的各个部分，完成后可导出为 Markdown 文件</p>
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
                value={dbddData.systemName}
                onChange={(e) => updateField('systemName', e.target.value)}
                placeholder="XXX系统"
              />
            </div>
            <div>
              <Label htmlFor="moduleName">模块名称</Label>
              <Input
                id="moduleName"
                value={dbddData.moduleName}
                onChange={(e) => updateField('moduleName', e.target.value)}
                placeholder="订单中心"
              />
            </div>
            <div>
              <Label htmlFor="version">版本</Label>
              <Input
                id="version"
                value={dbddData.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                value={dbddData.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="DBA-王五 / 后端-李四"
              />
            </div>
            <div>
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={dbddData.date}
                onChange={(e) => updateField('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filePath">文档存放路径</Label>
              <Input
                id="filePath"
                value={dbddData.filePath}
                onChange={(e) => updateField('filePath', e.target.value)}
                placeholder="docs/database/order-center-ddl-v1.0.md"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            数据库信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dbddData.documentInfo.map((info, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>{info.field}</Label>
                  <Input
                    value={info.field}
                    onChange={(e) => updateTableRow('documentInfo', index, 'field', e.target.value)}
                    placeholder="字段名"
                  />
                </div>
                <div>
                  <Label>内容</Label>
                  <Input
                    value={info.content}
                    onChange={(e) => updateTableRow('documentInfo', index, 'content', e.target.value)}
                    placeholder="内容"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version & Change Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            版本与变更记录
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
            {dbddData.changeLog.map((log, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">变更记录 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('changeLog', index)}
                    disabled={dbddData.changeLog.length === 1}
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
                      placeholder="王五"
                    />
                  </div>
                  <div>
                    <Label>变更描述</Label>
                    <Input
                      value={log.changes}
                      onChange={(e) => updateTableRow('changeLog', index, 'changes', e.target.value)}
                      placeholder="首版：订单主表、用户表、索引、初始数据脚本"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ER Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            ER 图
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="erDiagram">ER 图描述</Label>
            <Textarea
              id="erDiagram"
              value={dbddData.erDiagram}
              onChange={(e) => updateField('erDiagram', e.target.value)}
              placeholder="可以添加 Mermaid ER 图代码"
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Dictionary - Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            数据字典 - 表结构
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>数据表列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('tables', { tableName: '', description: "", engine: 'InnoDB' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            {dbddData.tables.map((table, tableIndex) => (
              <div key={tableIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">数据表 {tableIndex + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('tables', tableIndex)}
                    disabled={dbddData.tables.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>表名</Label>
                    <Input
                      value={table.tableName}
                      onChange={(e) => updateTableRow('tables', tableIndex, 'tableName', e.target.value)}
                      placeholder="t_user"
                    />
                  </div>
                  <div>
                    <Label>描述</Label>
                    <Input
                      value={table.description}
                      onChange={(e) => updateTableRow('tables', tableIndex, 'description', e.target.value)}
                      placeholder="用户表"
                    />
                  </div>
                  <div>
                    <Label>存储引擎</Label>
                    <Select
                      value={table.engine}
                      onValueChange={updateTableRow.bind(null, 'tables', tableIndex, 'engine')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="InnoDB">InnoDB</SelectItem>
                        <SelectItem value="MyISAM">MyISAM</SelectItem>
                        <SelectItem value="Memory">Memory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table Fields */}
                {table.tableName && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">字段列表</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTableField(table.tableName)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(dbddData.tableFields[table.tableName] || []).map((field, fieldIndex) => (
                        <div key={fieldIndex} className="border rounded p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">字段 {fieldIndex + 1}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTableField(table.tableName, fieldIndex)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">字段名</Label>
                              <Input
                                size="sm"
                                value={field.fieldName}
                                onChange={(e) => updateTableField(table.tableName, fieldIndex, 'fieldName', e.target.value)}
                                placeholder="id"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">类型</Label>
                              <Input
                                size="sm"
                                value={field.type}
                                onChange={(e) => updateTableField(table.tableName, fieldIndex, 'type', e.target.value)}
                                placeholder="BIGINT"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">可空</Label>
                              <Select
                                value={field.nullable}
                                onValueChange={updateTableField.bind(null, table.tableName, fieldIndex, 'nullable')}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="是">是</SelectItem>
                                  <SelectItem value="否">否</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">默认值</Label>
                              <Input
                                size="sm"
                                value={field.defaultValue}
                                onChange={(e) => updateTableField(table.tableName, fieldIndex, 'defaultValue', e.target.value)}
                                placeholder="自增"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">描述</Label>
                              <Input
                                size="sm"
                                value={field.description}
                                onChange={(e) => updateTableField(table.tableName, fieldIndex, 'description', e.target.value)}
                                placeholder="主键"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">索引</Label>
                              <Input
                                size="sm"
                                value={field.index}
                                onChange={(e) => updateTableField(table.tableName, fieldIndex, 'index', e.target.value)}
                                placeholder="PK"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Index Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            索引设计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>索引列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('indexes', { indexName: "", tableName: "", fields: "", type: "", note: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {dbddData.indexes.map((index, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">索引 {idx + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('indexes', idx)}
                    disabled={dbddData.indexes.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>索引名</Label>
                    <Input
                      value={index.indexName}
                      onChange={(e) => updateTableRow('indexes', idx, 'indexName', e.target.value)}
                      placeholder="uk_username"
                    />
                  </div>
                  <div>
                    <Label>表名</Label>
                    <Input
                      value={index.tableName}
                      onChange={(e) => updateTableRow('indexes', idx, 'tableName', e.target.value)}
                      placeholder="t_user"
                    />
                  </div>
                  <div>
                    <Label>字段</Label>
                    <Input
                      value={index.fields}
                      onChange={(e) => updateTableRow('indexes', idx, 'fields', e.target.value)}
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <Label>类型</Label>
                    <Select
                      value={index.type}
                      onValueChange={updateTableRow.bind(null, 'indexes', idx, 'type')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNIQUE">UNIQUE</SelectItem>
                        <SelectItem value="NORMAL">NORMAL</SelectItem>
                        <SelectItem value="FULLTEXT">FULLTEXT</SelectItem>
                        <SelectItem value="SPATIAL">SPATIAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>备注</Label>
                    <Input
                      value={index.note}
                      onChange={(e) => updateTableRow('indexes', idx, 'note', e.target.value)}
                      placeholder="用户名唯一"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Constraints & Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">7</Badge>
            约束 & 规则
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="constraintsRules">约束与规则</Label>
            <Textarea
              id="constraintsRules"
              value={dbddData.constraintsRules}
              onChange={(e) => updateField('constraintsRules', e.target.value)}
              placeholder="- **软删除**：所有业务查询必须带 `WHERE deleted_at IS NULL`。&#10;- **金额字段**：统一使用 `DECIMAL(10,2)`，禁止 `FLOAT`/`DOUBLE`。"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Initialization Script */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
            初始化脚本
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="initScript">SQL 初始化脚本</Label>
            <Textarea
              id="initScript"
              value={dbddData.initScript}
              onChange={(e) => updateField('initScript', e.target.value)}
              placeholder="-- 建库&#10;CREATE DATABASE IF NOT EXISTS order_center&#10;  DEFAULT CHARACTER SET utf8mb4&#10;  COLLATE utf8mb4_general_ci;"
              rows={8}
            />
          </div>
        </CardContent>
      </Card>

      {/* Capacity Estimation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">9</Badge>
            容量预估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>容量预估列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('capacityEstimation', { tableName: "", initialRows: "", yearlyGrowth: "", avgRowSize: "", yearSpace: "" })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {dbddData.capacityEstimation.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">表 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('capacityEstimation', index)}
                    disabled={dbddData.capacityEstimation.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <Label>表名</Label>
                    <Input
                      value={item.tableName}
                      onChange={(e) => updateTableRow('capacityEstimation', index, 'tableName', e.target.value)}
                      placeholder="t_user"
                    />
                  </div>
                  <div>
                    <Label>初始行数</Label>
                    <Input
                      value={item.initialRows}
                      onChange={(e) => updateTableRow('capacityEstimation', index, 'initialRows', e.target.value)}
                      placeholder="1 M"
                    />
                  </div>
                  <div>
                    <Label>年增长</Label>
                    <Input
                      value={item.yearlyGrowth}
                      onChange={(e) => updateTableRow('capacityEstimation', index, 'yearlyGrowth', e.target.value)}
                      placeholder="100 w"
                    />
                  </div>
                  <div>
                    <Label>平均行大小</Label>
                    <Input
                      value={item.avgRowSize}
                      onChange={(e) => updateTableRow('capacityEstimation', index, 'avgRowSize', e.target.value)}
                      placeholder="256 B"
                    />
                  </div>
                  <div>
                    <Label>1年空间</Label>
                    <Input
                      value={item.yearSpace}
                      onChange={(e) => updateTableRow('capacityEstimation', index, 'yearSpace', e.target.value)}
                      placeholder="~250 MB"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            安全与权限
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="securityPermissions">安全与权限设计</Label>
            <Textarea
              id="securityPermissions"
              value={dbddData.securityPermissions}
              onChange={(e) => updateField('securityPermissions', e.target.value)}
              placeholder="- **读写分离账号**&#10;  - `order_rw`：读写主库&#10;  - `order_ro`：只读从库&#10;- **敏感字段脱敏**：`email` 在日志中仅保留前 3 位 + 后 2 位。"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Recovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">11</Badge>
            备份 & 恢复
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="backupRecovery">备份与恢复策略</Label>
            <Textarea
              id="backupRecovery"
              value={dbddData.backupRecovery}
              onChange={(e) => updateField('backupRecovery', e.target.value)}
              placeholder="- **全量备份**：每天 02:00 `mysqldump --single-transaction`&#10;- **增量备份**：Binlog 保留 7 天&#10;- **恢复演练**：每季度进行一次 `table-level` 恢复演练并记录 RTO ≤ 30 min。"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Future Extensions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">12</Badge>
            未来扩展点
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="futureExtensions">未来扩展规划</Label>
            <Textarea
              id="futureExtensions"
              value={dbddData.futureExtensions}
              onChange={(e) => updateField('futureExtensions', e.target.value)}
              placeholder="- 分库分表：按 `user_id` 取模 1024 拆分（预留字段 `shard_key`）。&#10;- 冷热分离：历史订单迁移到 TiDB / OSS。"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
