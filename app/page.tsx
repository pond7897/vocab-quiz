"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [name, setName] = useState("")
  const [wordCount, setWordCount] = useState("")

  return (
    <div className="container flex flex-col items-center justify-center py-20 space-y-8 mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">แบบทดสอบคำศัพท์ ไทย-อังกฤษ</h1>
        <p className="text-muted-foreground max-w-md">
          ทดสอบคำศัพท์ภาษาอังกฤษ-ไทย ด้วยการเลือกคำตอบที่ถูกต้องจากตัวเลือกที่ให้มา
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start Learning</CardTitle>
          <CardDescription>กรอกชื่อของคุณ</CardDescription>
          <CardDescription>กรอกจำนวนคำที่ต้องการเล่น</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Enter number of words"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            min="1"
          />
          <div className="grid gap-4">
            <Link
              href={name && wordCount ? `/quiz?name=${encodeURIComponent(name)}&words=${wordCount}` : "#"}
              className="w-full"
            >
              <Button className="w-full" size="lg" disabled={!name || !wordCount}>
                เริ่มแบบทดสอบ
              </Button>
            </Link>
            <Link href={name ? `/practice?name=${encodeURIComponent(name)}` : "#"} className="w-full">
              <Button variant="outline" className="w-full" size="lg" disabled={!name}>
                โหมดฝึกฝน
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}