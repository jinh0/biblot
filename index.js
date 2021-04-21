const express = require('express')
const fs = require('fs/promises')
const cors = require('cors')

const bibleMetadata = require('./bible_nkjv.json')

const app = express()
app.use(cors())

app.get('/api/bible', (req, res) => {
  res.status(200).json({"message": "he who shall seek me will find me."})
})

app.get('/api/bible/:book/:chapter', async (req, res) => {
  const book = req.params.book.toLowerCase()
  const chapter = Number(req.params.chapter)

  if (!chapter) {
    return res.status(400).json({ message: "chapter must be a number" })
  }

  let text // this looks really ugly, but it works
  try {
    text = await fs.readFile(`./bible_nkjv/${book}/${chapter}.txt`)
  } catch (err) {
    return res.status(400).json({ message: "file doesn't exist" })
  }
  
  let verses = text.toString().split('\n')
  const bookMetadata = bibleMetadata.find(b => b.name === book)
  const contents = bookMetadata.chapters[chapter - 1].content

  const data = {
    book: book,
    chapter: chapter,
    verses: verses.slice(0, verses.length - 1),
    contents: contents
  }
  res.status(200).json(data)
})

app.get('/api/bible/:book/:chapter/:verse', async (req, res) => {
  const book = req.params.book.toLowerCase()
  const chapter = Number(req.params.chapter)

  if (!chapter)
    return res.status(400).json({ message: "chapter must be a number" })

  let text
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
