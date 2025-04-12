"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [name, setName] = useState("")

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
          <CardDescription>Enter your name to begin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid gap-4">
            <Link href={name ? `/quiz?name=${encodeURIComponent(name)}` : "#"} className="w-full">
              <Button className="w-full" size="lg" disabled={!name}>
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
        {/* <CardFooter className="flex justify-between">
          <Link href="/admin">
            <Button variant="ghost">Admin Panel</Button>
          </Link>
          <Link href={name ? `/stats?name=${encodeURIComponent(name)}` : "#"}>
            <Button variant="ghost" disabled={!name}>View Stats</Button>
          </Link>
        </CardFooter> */}
      </Card>
    </div>
  )
}