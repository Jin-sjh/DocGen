"use client"

import { useState, useEffect, useRef } from "react"
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

interface PRDData {
  // Header info
  documentName: string
  productOwner: string
  writeDate: string
  reviewDate: string
  status: string
  
  // Background & Goals
  userPainPoint: string
  businessGoal: string
  strategicAlignment: string
  
  // Scope
  inScope: string[]
  outOfScope: string[]
  
  // User stories
  userStories: TableRow[]
  
  // Functional logic
  flowchartDescription: string
  featureList: TableRow[]
  
  // Prototype & Interaction
  prototypeLink: string
  keyInteractions: string
  
  // Data requirements
  dataRequirements: TableRow[]
  
  // Non-functional requirements
  nonFunctionalReqs: TableRow[]
  
  // Acceptance criteria
  acceptanceCriteria: string[]
  
  // Risks & Dependencies
  risks: TableRow[]
  
  // Milestones
  milestones: TableRow[]
  
  // Change log
  changeLog: TableRow[]
  
  // Appendix
  appendix: string[]
}

interface PRDGeneratorProps {
  initialData?: PRDData | null
  onDataChange?: (data: PRDData) => void
}

// 使用 useMemo 来缓存默认数据，避免每次渲染时创建新对象
const getDefaultPRDData = (): PRDData => ({
  documentName: "",
  productOwner: "",
  writeDate: new Date().toISOString().split('T')[0],
  reviewDate: "",
  status: "草稿",
  userPainPoint: "",
  businessGoal: "",
  strategicAlignment: "",
  inScope: [""],
  outOfScope: [""],
  userStories: [{ role: "", scenario: "", requirement: "", value: "" }],
  flowchartDescription: "",
  featureList: [{ feature: "", trigger: "", precondition: "", rules: "", exception: "" }],
  prototypeLink: "",
  keyInteractions: "",
  dataRequirements: [{ input: "", output: "", event: "", note: "" }],
  nonFunctionalReqs: [{ type: "", requirement: "" }],
  acceptanceCriteria: [""],
  risks: [{ description: "", probability: "", impact: "", solution: "", owner: "" }],
  milestones: [{ stage: "", time: "", deliverable: "", owner: "" }],
  changeLog: [{ version: "", date: "", changes: "", author: "" }],
  appendix: [""]
})

export function PRDGenerator({ initialData, onDataChange }: PRDGeneratorProps) {
  // 使用初始数据或默认数据
  const [prdData, setPRDData] = useState<PRDData>(initialData || getDefaultPRDData())
  const isInitializedRef = useRef(false)

  // 当初始数据变化时，更新状态
  useEffect(() => {
    if (initialData) {
      setPRDData(initialData)
    } else {
      setPRDData(getDefaultPRDData())
    }
    isInitializedRef.current = true
  }, [initialData])

  // 当数据变化时，通知父组件
  useEffect(() => {
    // 避免在初始化时触发更新
    if (!isInitializedRef.current) return
    
    if (onDataChange) {
      onDataChange(prdData)
    }
  }, [prdData]) // 移除onDataChange依赖，避免无限循环

  // 当initialData变为null时（重置时），确保重置isInitializedRef
  useEffect(() => {
    if (!initialData) {
      isInitializedRef.current = false
    }
  }, [initialData])

  const updateField = (field: keyof PRDData, value: any) => {
    try {
      setPRDData(prev => ({ ...prev, [field]: value }))
    } catch (error) {
      console.error('更新字段失败:', error)
    }
  }

  const addArrayItem = (field: keyof PRDData, defaultValue: any) => {
    try {
      setPRDData(prev => ({
        ...prev,
        [field]: [...(prev[field] as any[]), defaultValue]
      }))
    } catch (error) {
      console.error('添加数组项失败:', error)
    }
  }

  const removeArrayItem = (field: keyof PRDData, index: number) => {
    try {
      setPRDData(prev => ({
        ...prev,
        [field]: (prev[field] as any[]).filter((_, i) => i !== index)
      }))
    } catch (error) {
      console.error('删除数组项失败:', error)
    }
  }

  const updateArrayItem = (field: keyof PRDData, index: number, value: any) => {
    try {
      setPRDData(prev => ({
        ...prev,
        [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
      }))
    } catch (error) {
      console.error('更新数组项失败:', error)
    }
  }

  const updateTableRow = (field: keyof PRDData, index: number, key: string, value: string) => {
    try {
      setPRDData(prev => ({
        ...prev,
        [field]: (prev[field] as TableRow[]).map((row, i) => 
          i === index ? { ...row, [key]: value } : row
        )
      }))
    } catch (error) {
      console.error('更新表格行失败:', error)
    }
  }

  const generateMarkdown = () => {
    const md = `# 🎯 产品需求文档（PRD）

**文档名称**：${prdData.documentName}PRD_v1.0  
**产品负责人**：${prdData.productOwner}  
**撰写日期**：${prdData.writeDate}  
**评审日期**：${prdData.reviewDate}  
**当前状态**：${prdData.status}

---

## 1. 项目背景 & 目标

| 字段 | 内容 |
|---|---|
| 用户痛点 | ${prdData.userPainPoint} |
| 业务目标 | ${prdData.businessGoal} |
| 战略对齐 | ${prdData.strategicAlignment} |

---

## 2. 需求范围

- **本期需求（In Scope）**
${prdData.inScope.filter(item => item.trim()).map(item => `  - ${item}`).join('\n')}

- **明确不做（Out of Scope）**
${prdData.outOfScope.filter(item => item.trim()).map(item => `  - ${item}`).join('\n')}

---

## 3. 用户故事

| 用户角色 | 场景 | 需求描述 | 价值 |
|---|---|---|---|
${prdData.userStories.map(story => `| ${story.role} | ${story.scenario} | ${story.requirement} | ${story.value} |`).join('\n')}

---

## 4. 功能逻辑

### 4.1 流程图

${prdData.flowchartDescription}

### 4.2 功能清单 & 规则

| 功能点 | 触发条件 | 前置条件 | 规则 & 限制 | 异常处理 |
|---|---|---|---|---|
${prdData.featureList.map(feature => `| ${feature.feature} | ${feature.trigger} | ${feature.precondition} | ${feature.rules} | ${feature.exception} |`).join('\n')}

---

## 5. 原型 & 交互

- **原型链接**：${prdData.prototypeLink}
- **关键交互说明**
${prdData.keyInteractions}

---

## 6. 数据需求

| 输入 | 输出 | 埋点事件 | 备注 |
|---|---|---|---|
${prdData.dataRequirements.map(req => `| ${req.input} | ${req.output} | ${req.event} | ${req.note} |`).join('\n')}

---

## 7. 非功能需求

| 类型 | 要求 |
|---|---|
${prdData.nonFunctionalReqs.map(req => `| ${req.type} | ${req.requirement} |`).join('\n')}

---

## 8. 验收标准（DoD）

${prdData.acceptanceCriteria.filter(item => item.trim()).map(item => `- [ ] ${item}`).join('\n')}

---

## 9. 风险 & 依赖

| 风险描述 | 概率 | 影响 | 应对方案 | Owner |
|---|---|---|---|---|
${prdData.risks.map(risk => `| ${risk.description} | ${risk.probability} | ${risk.impact} | ${risk.solution} | ${risk.owner} |`).join('\n')}

---

## 10. 里程碑 & 资源

| 阶段 | 时间 | 交付物 | 负责人 |
|---|---|---|---|
${prdData.milestones.map(milestone => `| ${milestone.stage} | ${milestone.time} | ${milestone.deliverable} | ${milestone.owner} |`).join('\n')}

---

## 11. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|---|---|---|---|
${prdData.changeLog.map(log => `| ${log.version} | ${log.date} | ${log.changes} | ${log.author} |`).join('\n')}

---

### 🔗 附录

${prdData.appendix.filter(item => item.trim()).map(item => `- ${item}`).join('\n')}

${'> **使用提示**：  \n> 1. 敏捷迭代可精简「里程碑」章节，改用 Jira Sprint 管理。  \n> 2. 复杂业务请补充「状态机图」和「领域模型图」。  \n> 3. 评审前请在「风险 & 依赖」栏提前 @ 全部干系人补充隐藏坑点。'}`

    return md
  }

  const exportMarkdown = () => {
    const markdown = generateMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prdData.documentName || 'PRD'}_v1.0.md`
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
          <h1 className="text-2xl font-bold text-gray-900">PRD 产品需求文档</h1>
          <p className="text-gray-600 mt-1">填写产品需求文档的各个部分，完成后可导出为 Markdown 文件</p>
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
              <Label htmlFor="documentName">文档名称</Label>
              <Input
                id="documentName"
                value={prdData.documentName}
                onChange={(e) => {
                  updateField('documentName', e.target.value)
                }}
                placeholder="功能/项目名称"
              />
            </div>
            <div>
              <Label htmlFor="productOwner">产品负责人</Label>
              <Input
                id="productOwner"
                value={prdData.productOwner}
                onChange={(e) => {
                  updateField('productOwner', e.target.value)
                }}
                placeholder="姓名"
              />
            </div>
            <div>
              <Label htmlFor="writeDate">撰写日期</Label>
              <Input
                id="writeDate"
                type="date"
                value={prdData.writeDate}
                onChange={(e) => {
                  updateField('writeDate', e.target.value)
                }}
              />
            </div>
            <div>
              <Label htmlFor="reviewDate">评审日期</Label>
              <Input
                id="reviewDate"
                type="date"
                value={prdData.reviewDate}
                onChange={(e) => {
                  updateField('reviewDate', e.target.value)
                }}
              />
            </div>
            <div>
              <Label htmlFor="status">当前状态</Label>
              <Select value={prdData.status} onValueChange={updateField.bind(null, 'status')}>
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

      {/* Project Background & Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            项目背景 & 目标
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userPainPoint">用户痛点</Label>
            <Textarea
              id="userPainPoint"
              value={prdData.userPainPoint}
              onChange={(e) => updateField('userPainPoint', e.target.value)}
              placeholder="一句话描述用户高频痛点，附数据或用户原话"
            />
          </div>
          <div>
            <Label htmlFor="businessGoal">业务目标</Label>
            <Textarea
              id="businessGoal"
              value={prdData.businessGoal}
              onChange={(e) => updateField('businessGoal', e.target.value)}
              placeholder="量化指标：上线后X周内将某指标提升/降低Y%"
            />
          </div>
          <div>
            <Label htmlFor="strategicAlignment">战略对齐</Label>
            <Textarea
              id="strategicAlignment"
              value={prdData.strategicAlignment}
              onChange={(e) => updateField('strategicAlignment', e.target.value)}
              placeholder="与公司年度OKR/北极星指标的关联点"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requirements Scope */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            需求范围
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>本期需求（In Scope）</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('inScope', '')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {prdData.inScope.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateArrayItem('inScope', index, e.target.value)}
                    placeholder="需求描述"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('inScope', index)}
                    disabled={prdData.inScope.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>明确不做（Out of Scope）</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('outOfScope', '')}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {prdData.outOfScope.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateArrayItem('outOfScope', index, e.target.value)}
                    placeholder="超出本期资源或优先级低的功能"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('outOfScope', index)}
                    disabled={prdData.outOfScope.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            用户故事
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>用户故事列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('userStories', { role: '', scenario: '', requirement: '', value: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.userStories.map((story, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">用户故事 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('userStories', index)}
                    disabled={prdData.userStories.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>用户角色</Label>
                    <Input
                      value={story.role}
                      onChange={(e) => updateTableRow('userStories', index, 'role', e.target.value)}
                      placeholder="角色A"
                    />
                  </div>
                  <div>
                    <Label>场景</Label>
                    <Input
                      value={story.scenario}
                      onChange={(e) => updateTableRow('userStories', index, 'scenario', e.target.value)}
                      placeholder="使用场景"
                    />
                  </div>
                  <div>
                    <Label>需求描述</Label>
                    <Input
                      value={story.requirement}
                      onChange={(e) => updateTableRow('userStories', index, 'requirement', e.target.value)}
                      placeholder="需要做什么"
                    />
                  </div>
                  <div>
                    <Label>价值</Label>
                    <Input
                      value={story.value}
                      onChange={(e) => updateTableRow('userStories', index, 'value', e.target.value)}
                      placeholder="解决什么问题"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Functional Logic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            功能逻辑
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="flowchartDescription">流程图描述</Label>
            <Textarea
              id="flowchartDescription"
              value={prdData.flowchartDescription}
              onChange={(e) => updateField('flowchartDescription', e.target.value)}
              placeholder={'描述业务流程或添加 Mermaid 流程图代码'}
              rows={4}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>功能清单 & 规则</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('featureList', { feature: '', trigger: '', precondition: '', rules: '', exception: '' })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {prdData.featureList.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">功能 {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('featureList', index)}
                      disabled={prdData.featureList.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>功能点</Label>
                      <Input
                        value={feature.feature}
                        onChange={(e) => updateTableRow('featureList', index, 'feature', e.target.value)}
                        placeholder="例：批量删除"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>触发条件</Label>
                        <Input
                          value={feature.trigger}
                          onChange={(e) => updateTableRow('featureList', index, 'trigger', e.target.value)}
                          placeholder="点击按钮"
                        />
                      </div>
                      <div>
                        <Label>前置条件</Label>
                        <Input
                          value={feature.precondition}
                          onChange={(e) => updateTableRow('featureList', index, 'precondition', e.target.value)}
                          placeholder="已选择记录"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>规则 & 限制</Label>
                      <Input
                        value={feature.rules}
                        onChange={(e) => updateTableRow('featureList', index, 'rules', e.target.value)}
                        placeholder={'最多100条/次；需二次确认'}
                      />
                    </div>
                    <div>
                      <Label>异常处理</Label>
                      <Input
                        value={feature.exception}
                        onChange={(e) => updateTableRow('featureList', index, 'exception', e.target.value)}
                        placeholder="网络中断保留已选记录"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prototype & Interaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">6</Badge>
            原型 & 交互
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prototypeLink">原型链接</Label>
            <Input
              id="prototypeLink"
              value={prdData.prototypeLink}
              onChange={(e) => updateField('prototypeLink', e.target.value)}
              placeholder="Figma / Axure 地址"
            />
          </div>
          <div>
            <Label htmlFor="keyInteractions">关键交互说明</Label>
            <Textarea
              id="keyInteractions"
              value={prdData.keyInteractions}
              onChange={(e) => updateField('keyInteractions', e.target.value)}
              placeholder={'点击[按钮A] → 弹出[弹窗B]（文案："确认删除？此操作不可撤销"）'}
              rows={3}
            />
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
              onClick={() => addArrayItem('dataRequirements', { input: '', output: '', event: '', note: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.dataRequirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">数据需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('dataRequirements', index)}
                    disabled={prdData.dataRequirements.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>输入</Label>
                    <Input
                      value={req.input}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'input', e.target.value)}
                      placeholder="字段 / 参数"
                    />
                  </div>
                  <div>
                    <Label>输出</Label>
                    <Input
                      value={req.output}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'output', e.target.value)}
                      placeholder="返回 / 展示结果"
                    />
                  </div>
                  <div>
                    <Label>埋点事件</Label>
                    <Input
                      value={req.event}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'event', e.target.value)}
                      placeholder="事件名 + 参数"
                    />
                  </div>
                  <div>
                    <Label>备注</Label>
                    <Input
                      value={req.note}
                      onChange={(e) => updateTableRow('dataRequirements', index, 'note', e.target.value)}
                      placeholder="是否需要服务端日志"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Non-functional Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">8</Badge>
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
              onClick={() => addArrayItem('nonFunctionalReqs', { type: '', requirement: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.nonFunctionalReqs.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">需求 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('nonFunctionalReqs', index)}
                    disabled={prdData.nonFunctionalReqs.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>类型</Label>
                    <Select
                      value={req.type}
                      onValueChange={updateTableRow.bind(null, 'nonFunctionalReqs', index, 'type')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="性能">性能</SelectItem>
                        <SelectItem value="兼容性">兼容性</SelectItem>
                        <SelectItem value="安全">安全</SelectItem>
                        <SelectItem value="国际化">国际化</SelectItem>
                        <SelectItem value="可用性">可用性</SelectItem>
                        <SelectItem value="可维护性">可维护性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>要求</Label>
                    <Input
                      value={req.requirement}
                      onChange={(e) => updateTableRow('nonFunctionalReqs', index, 'requirement', e.target.value)}
                      placeholder="具体要求描述"
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
            {prdData.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={criteria}
                  onChange={(e) => updateArrayItem('acceptanceCriteria', index, e.target.value)}
                  placeholder="功能测试用例全部通过（见测试用例文档）"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('acceptanceCriteria', index)}
                  disabled={prdData.acceptanceCriteria.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risks & Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">10</Badge>
            风险 & 依赖
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>风险依赖列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('risks', { description: '', probability: '', impact: '', solution: '', owner: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.risks.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">风险 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('risks', index)}
                    disabled={prdData.risks.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>风险描述</Label>
                    <Input
                      value={risk.description}
                      onChange={(e) => updateTableRow('risks', index, 'description', e.target.value)}
                      placeholder="依赖方接口延迟"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>概率</Label>
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
                      <Label>影响</Label>
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
                      <Label>Owner</Label>
                      <Input
                        value={risk.owner}
                        onChange={(e) => updateTableRow('risks', index, 'owner', e.target.value)}
                        placeholder="后端负责人"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>应对方案</Label>
                    <Input
                      value={risk.solution}
                      onChange={(e) => updateTableRow('risks', index, 'solution', e.target.value)}
                      placeholder={'降级为"单次删除10条"'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">11</Badge>
            里程碑 & 资源
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>里程碑列表</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('milestones', { stage: '', time: '', deliverable: '', owner: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.milestones.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">里程碑 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('milestones', index)}
                    disabled={prdData.milestones.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>阶段</Label>
                    <Input
                      value={milestone.stage}
                      onChange={(e) => updateTableRow('milestones', index, 'stage', e.target.value)}
                      placeholder="PRD 评审"
                    />
                  </div>
                  <div>
                    <Label>时间</Label>
                    <Input
                      type="date"
                      value={milestone.time}
                      onChange={(e) => updateTableRow('milestones', index, 'time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>交付物</Label>
                    <Input
                      value={milestone.deliverable}
                      onChange={(e) => updateTableRow('milestones', index, 'deliverable', e.target.value)}
                      placeholder="冻结版 PRD"
                    />
                  </div>
                  <div>
                    <Label>负责人</Label>
                    <Input
                      value={milestone.owner}
                      onChange={(e) => updateTableRow('milestones', index, 'owner', e.target.value)}
                      placeholder="PM"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">12</Badge>
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
              onClick={() => addArrayItem('changeLog', { version: '', date: '', changes: '', author: '' })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {prdData.changeLog.map((log, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">变更记录 {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('changeLog', index)}
                    disabled={prdData.changeLog.length === 1}
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
                    <Label>变更内容</Label>
                    <Input
                      value={log.changes}
                      onChange={(e) => updateTableRow('changeLog', index, 'changes', e.target.value)}
                      placeholder="初版"
                    />
                  </div>
                  <div>
                    <Label>作者</Label>
                    <Input
                      value={log.author}
                      onChange={(e) => updateTableRow('changeLog', index, 'author', e.target.value)}
                      placeholder="PM"
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
            <Badge variant="outline">13</Badge>
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
            {prdData.appendix.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('appendix', index, e.target.value)}
                  placeholder="A. 竞品分析报告链接"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('appendix', index)}
                  disabled={prdData.appendix.length === 1}
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
