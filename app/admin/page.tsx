"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { vocabularyData } from "@/lib/vocabulary-data"
import { Pencil, Trash, Plus, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const [vocabList, setVocabList] = useState(vocabularyData)
  const [newWord, setNewWord] = useState("")
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("")
  const [newTranslation, setNewTranslation] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editWord, setEditWord] = useState("")
  const [editPartOfSpeech, setEditPartOfSpeech] = useState("")
  const [editTranslation, setEditTranslation] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddVocab = () => {
    if (!newWord || !newPartOfSpeech || !newTranslation) return

    const newVocab = {
      id: Date.now().toString(),
      word: newWord,
      partOfSpeech: newPartOfSpeech,
      translation: newTranslation,
    }

    setVocabList([...vocabList, newVocab])
    setNewWord("")
    setNewPartOfSpeech("")
    setNewTranslation("")
  }

  const handleEditVocab = (id: string) => {
    const vocabToEdit = vocabList.find((vocab) => vocab.id === id)
    if (!vocabToEdit) return

    setEditingId(id)
    setEditWord(vocabToEdit.word)
    setEditPartOfSpeech(vocabToEdit.partOfSpeech)
    setEditTranslation(vocabToEdit.translation)
  }

  const handleUpdateVocab = () => {
    if (!editingId || !editWord || !editPartOfSpeech || !editTranslation) return

    const updatedVocabList = vocabList.map((vocab) =>
      vocab.id === editingId
        ? { ...vocab, word: editWord, partOfSpeech: editPartOfSpeech, translation: editTranslation }
        : vocab,
    )

    setVocabList(updatedVocabList)
    setEditingId(null)
  }

  const handleDeleteVocab = (id: string) => {
    const updatedVocabList = vocabList.filter((vocab) => vocab.id !== id)
    setVocabList(updatedVocabList)
  }

  const filteredVocabList = vocabList.filter(
    (vocab) =>
      vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vocab.translation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container py-10">
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
                  <Label htmlFor="new-translation">Thai Translation</Label>
                  <Input
                    id="new-translation"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    placeholder="Enter Thai translation"
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
            <CardHeader>
              <CardTitle>Vocabulary List</CardTitle>
              <CardDescription>Manage your vocabulary database</CardDescription>
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
                            vocab.partOfSpeech
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
                  </TableBody>
                </Table>
              </div>
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

