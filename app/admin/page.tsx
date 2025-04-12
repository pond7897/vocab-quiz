"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash, Plus, ArrowLeft, Loader2 } from "lucide-react"
import { SeedButton } from "@/components/admin/seed-button"
import { getAllVocabulary } from "@/lib/vocabulary-service"
import { supabase } from "@/lib/supabase"
import type { Vocabulary } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function AdminPage() {
  const [vocabList, setVocabList] = useState<Vocabulary[]>([])
  const [newWord, setNewWord] = useState("")
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("")
  const [newTranslation, setNewTranslation] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editWord, setEditWord] = useState("")
  const [editPartOfSpeech, setEditPartOfSpeech] = useState("")
  const [editTranslation, setEditTranslation] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVocabulary = async () => {
      setIsLoading(true)
      const data = await getAllVocabulary()
      setVocabList(data)
      setIsLoading(false)
    }

    fetchVocabulary()
  }, [])

  const handleAddVocab = async () => {
    if (!newWord || !newPartOfSpeech || !newTranslation) return

    const newVocab = {
      word: newWord,
      part_of_speech: newPartOfSpeech,
      translation: newTranslation,
    }

    try {
      const { data, error } = await supabase.from("vocabulary").insert([newVocab]).select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setVocabList([...vocabList, data[0]])
        toast({
          title: "Success",
          description: "Vocabulary added successfully",
        })
      }

      setNewWord("")
      setNewPartOfSpeech("")
      setNewTranslation("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add vocabulary",
        variant: "destructive",
      })
    }
  }

  const handleEditVocab = (id: string) => {
    const vocabToEdit = vocabList.find((vocab) => vocab.id === id)
    if (!vocabToEdit) return

    setEditingId(id)
    setEditWord(vocabToEdit.word)
    setEditPartOfSpeech(vocabToEdit.part_of_speech)
    setEditTranslation(vocabToEdit.translation)
  }

  const handleUpdateVocab = async () => {
    if (!editingId || !editWord || !editPartOfSpeech || !editTranslation) return

    try {
      const { error } = await supabase
        .from("vocabulary")
        .update({
          word: editWord,
          part_of_speech: editPartOfSpeech,
          translation: editTranslation,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)

      if (error) {
        throw error
      }

      // Update local state
      const updatedVocabList = vocabList.map((vocab) =>
        vocab.id === editingId
          ? {
              ...vocab,
              word: editWord,
              part_of_speech: editPartOfSpeech,
              translation: editTranslation,
              updated_at: new Date().toISOString(),
            }
          : vocab,
      )

      setVocabList(updatedVocabList)
      setEditingId(null)

      toast({
        title: "Success",
        description: "Vocabulary updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update vocabulary",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVocab = async (id: string) => {
    try {
      const { error } = await supabase.from("vocabulary").delete().eq("id", id)

      if (error) {
        throw error
      }

      const updatedVocabList = vocabList.filter((vocab) => vocab.id !== id)
      setVocabList(updatedVocabList)

      toast({
        title: "Success",
        description: "Vocabulary deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vocabulary",
        variant: "destructive",
      })
    }
  }

  const filteredVocabList = vocabList.filter(
    (vocab) =>
      vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vocab.translation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
      </div>

      <Tabs defaultValue="vocabulary">
        <TabsList className="mb-6">
          <TabsTrigger value="vocabulary">Vocabulary Management</TabsTrigger>
          <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Vocabulary</CardTitle>
              <CardDescription>Add a new word to the vocabulary database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="new-word">English Word</Label>
                  <Input
                    id="new-word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter English word"
                  />
                </div>
                <div>
                  <Label htmlFor="new-part-of-speech">Part of Speech</Label>
                  <Input
                    id="new-part-of-speech"
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    placeholder="e.g., n., v., adj."
                  />
                </div>
                <div>
                  <Label htmlFor="new-translation">คำในภาษาไทย</Label>
                  <Input
                    id="new-translation"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    placeholder="กรอกคำแปลเป็นภาษาไทย"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddVocab} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Word
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vocabulary List</CardTitle>
                <CardDescription>Manage your vocabulary database</CardDescription>
              </div>
              <SeedButton />
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search vocabulary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>English Word</TableHead>
                        <TableHead>Part of Speech</TableHead>
                        <TableHead>Thai Translation</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVocabList.map((vocab) => (
                        <TableRow key={vocab.id}>
                          <TableCell>
                            {editingId === vocab.id ? (
                              <Input value={editWord} onChange={(e) => setEditWord(e.target.value)} />
                            ) : (
                              vocab.word
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === vocab.id ? (
                              <Input value={editPartOfSpeech} onChange={(e) => setEditPartOfSpeech(e.target.value)} />
                            ) : (
                              vocab.part_of_speech
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === vocab.id ? (
                              <Input value={editTranslation} onChange={(e) => setEditTranslation(e.target.value)} />
                            ) : (
                              vocab.translation
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId === vocab.id ? (
                              <Button onClick={handleUpdateVocab} size="sm">
                                Save
                              </Button>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEditVocab(vocab.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteVocab(vocab.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredVocabList.length === 0 && !isLoading && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            ไม่มีคำศัพท์ในฐานข้อมูล
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
              <CardDescription>Configure quiz behavior and options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questions-per-quiz">Questions per Quiz</Label>
                  <Input id="questions-per-quiz" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="time-limit">Time Limit (seconds per question)</Label>
                  <Input id="time-limit" type="number" defaultValue="30" />
                </div>
                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
