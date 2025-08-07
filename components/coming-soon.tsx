"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Lightbulb } from 'lucide-react'

interface ComingSoonProps {
  templateName: string
  description: string
}

export function ComingSoon({ templateName, description }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            {templateName}
            <Badge variant="secondary">即将推出</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{description}</p>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm font-medium">开发中</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              我们正在努力开发这个模板，敬请期待！
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
