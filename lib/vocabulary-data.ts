export interface VocabularyItem {
  id: string
  word: string
  partOfSpeech: string
  translation: string
}

export const vocabularyData: VocabularyItem[] = [
  {
    id: "1",
    word: "abandon",
    partOfSpeech: "n.",
    translation: "การละทิ้ง, การทอดทิ้ง",
  },
  {
    id: "2",
    word: "ability",
    partOfSpeech: "n.",
    translation: "ความสามารถ",
  },
  {
    id: "3",
    word: "above",
    partOfSpeech: "prep.",
    translation: "เหนือ, ข้างบน",
  },
  {
    id: "4",
    word: "abroad",
    partOfSpeech: "adv.",
    translation: "ต่างประเทศ",
  },
  {
    id: "5",
    word: "absence",
    partOfSpeech: "n.",
    translation: "การขาด, การไม่อยู่",
  },
  {
    id: "6",
    word: "absolutely",
    partOfSpeech: "adv.",
    translation: "อย่างแน่นอน, โดยสิ้นเชิง",
  },
  {
    id: "7",
    word: "academic",
    partOfSpeech: "adj.",
    translation: "เกี่ยวกับการศึกษา, ทางวิชาการ",
  },
  {
    id: "8",
    word: "accept",
    partOfSpeech: "v.",
    translation: "ยอมรับ",
  },
  {
    id: "9",
    word: "access",
    partOfSpeech: "v.",
    translation: "เข้าถึง",
  },
  {
    id: "10",
    word: "accident",
    partOfSpeech: "n.",
    translation: "อุบัติเหตุ",
  },
  {
    id: "11",
    word: "accommodation",
    partOfSpeech: "n.",
    translation: "ที่พักอาศัย",
  },
  {
    id: "12",
    word: "accomplish",
    partOfSpeech: "v.",
    translation: "ทำให้สำเร็จ, บรรลุ",
  },
  {
    id: "13",
    word: "according to",
    partOfSpeech: "prep.",
    translation: "ตามที่",
  },
  {
    id: "14",
    word: "account",
    partOfSpeech: "n.",
    translation: "บัญชี, การบัญชี",
  },
  {
    id: "15",
    word: "accurate",
    partOfSpeech: "adj.",
    translation: "แม่นยำ, ถูกต้อง",
  },
  // Note: This is a subset of the data. In a real application, you would import all vocabulary items
]
