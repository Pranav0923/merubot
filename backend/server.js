require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const pdfParse = require("pdf-parse")
const sendEmail = require("./utils/sendEmail")

console.log("sendEmail:", typeof sendEmail)
console.log("PDF PARSE EXPORT:")
console.log(pdfParse)

const axios = require("axios")
const PDFDocument = require("pdfkit")
const ExcelJS = require("exceljs")


const User = require("./models/User")
const Candidate = require("./models/Candidate")
const Analysis = require("./models/Analysis")


const app = express()

// Multer Storage
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads")
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    )
  }

})

const upload = multer({ storage })

// Middleware
app.use(cors())
app.use(express.json())

app.use("/uploads", express.static("uploads"))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected")
  })
  .catch((err) => {
    console.log(err)
  })

// Home Route
app.get("/", (req, res) => {
  res.send("MeruBot Backend Running")
})

// Test API
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from MeruBot Backend 🚀"
  })
})

// Signup API
app.post("/api/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.json({
      message: "User registered successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server Error"
    })

  }

})

// Login API
app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({
        message: "Invalid credentials"
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server Error"
    })

  }

})

// Add Candidate API
app.post("/api/candidate", async (req, res) => {

  try {

    const { name, email, role, experience } = req.body

    const newCandidate = new Candidate({
      name,
      email,
      role,
      experience
    })

    await newCandidate.save()

    res.json({
      message: "Candidate added successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server Error"
    })

  }

})

// Get All Candidates API
app.get("/api/candidates", async (req, res) => {

  try {

    const candidates = await Candidate.find()

    res.json(candidates)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server Error"
    })

  }

})

// Resume Upload API
app.post(
  "/api/upload-resume",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded"
        })

      }

      res.json({
        message: "Resume uploaded successfully",
        file: req.file.filename
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Upload failed"
      })

    }

  }
)

// AI Resume Analysis API
app.post(
  "/api/analyze-resume",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        })
      }

      // Read PDF
      const dataBuffer = fs.readFileSync(req.file.path)

      // Extract text
      const pdfData = await pdfParse(dataBuffer)

      const resumeText = pdfData.text

      // Send to Ollama
      const aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",
          prompt: `

You are an expert ATS (Applicant Tracking System) and HR recruiter.

Analyze this resume and provide:

1. ATS Score (0-100)
2. Candidate Summary
3. Technical Skills
4. Experience Level
5. Strengths
6. Weaknesses
7. Missing Skills
8. Suggested Job Roles
9. Hiring Recommendation

Use this format:

ATS Score: XX/100

Candidate Summary:
...

Technical Skills:
- Skill 1
- Skill 2

Experience Level:
...

Strengths:
- ...

Weaknesses:
- ...

Missing Skills:
- ...

Suggested Job Roles:
- ...

Hiring Recommendation:
...

Resume:

${resumeText}

`,
          stream: false
        }
      )

      const response = aiResponse.data.response

      const scoreMatch =
        response.match(/ATS Score:\s*(\d+)/i)

      const atsScore =
        scoreMatch
          ? parseInt(scoreMatch[1])
          : 0

      const newAnalysis = new Analysis({

        candidateName:
          req.body.name || "Unknown",

        analysis: response,

        atsScore

      })

      await newAnalysis.save()

      res.json({
        analysis: response
      })

    } catch (error) {

      console.log("FULL ERROR:")
      console.log(error)

      res.status(500).json({
        message: "AI Analysis Failed"
      })

    }

  }
)

// AI Interview Questions API
app.post(
  "/api/interview-questions",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        })
      }

      const dataBuffer = fs.readFileSync(req.file.path)

      const pdfData = await pdfParse(dataBuffer)

      const resumeText = pdfData.text

      const aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",

          prompt: `

Based on this resume generate:

1. 10 Technical Interview Questions
2. 5 HR Interview Questions
3. 5 Project-Based Questions

Resume:

${resumeText}

`,
          stream: false
        }
      )

      const response = aiResponse.data.response

      const newQuestions = new Analysis({

        candidateName: req.body.name || "Unknown",

        analysis: "",

        questions: response

      })

      await newQuestions.save()

      res.json({
        questions: response
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Question Generation Failed"
      })

    }

  }
)

// Get Analysis History
app.get("/api/history", async (req, res) => {

  try {

    const history = await Analysis.find()
      .sort({ createdAt: -1 })

    res.json(history)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to fetch history"
    })

  }

})

// job-match
app.post(
  "/api/job-match",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        })
      }

      const { jobDescription } = req.body

      const dataBuffer = fs.readFileSync(req.file.path)

      const pdfData = await pdfParse(dataBuffer)

      const resumeText = pdfData.text

      const aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",

          prompt: `

Analyze this resume against the job description.

Provide:

1. Match Score (0-100%)
2. Matched Skills
3. Missing Skills
4. Strengths
5. Weaknesses
6. Hiring Recommendation

Job Description:

${jobDescription}

Resume:

${resumeText}

`,
          stream: false
        }
      )

      const response = aiResponse.data.response

      const newMatch = new Analysis({

        candidateName: req.body.name || "Unknown",

        analysis: response,

        questions: ""

      })

      await newMatch.save()

      res.json({
        match: response
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Job Match Failed"
      })

    }

  }
)

// delete candidate
app.delete(
  "/api/candidate/:id",
  async (req, res) => {

    try {

      await Candidate.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message: "Candidate deleted"
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Delete failed"
      })

    }

  }
)

// candidate status
app.put(
  "/api/candidate-status/:id",
  async (req, res) => {

    try {

      const { status } = req.body

      await Candidate.findByIdAndUpdate(
        req.params.id,
        { status }
      )

      res.json({
        message: "Status updated"
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Update failed"
      })

    }

  }
)

// evaluate answer
app.post(
  "/api/evaluate-answer",
  async (req, res) => {

    try {

      const { question, answer } = req.body

      const aiResponse = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "llama3.2",

          prompt: `

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer and provide:

1. Score out of 10
2. Strengths
3. Improvements
4. Final Feedback

`,
          stream: false
        }
      )

      res.json({
        feedback: aiResponse.data.response
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Evaluation Failed"
      })

    }

  }
)

// dowload report
app.post(
  "/api/download-report",
  async (req, res) => {

    try {

      const {
        candidateName,
        analysis
      } = req.body

      const doc = new PDFDocument()

      res.setHeader(
        "Content-Type",
        "application/pdf"
      )

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=report.pdf"
      )

      doc.pipe(res)

      doc
        .fontSize(22)
        .text("MeruBot AI Report")

      doc.moveDown()

      doc
        .fontSize(16)
        .text(`Candidate: ${candidateName}`)

      doc.moveDown()

      doc
        .fontSize(12)
        .text(analysis)

      doc.end()

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "PDF generation failed"
      })

    }

  }
)

// rankings
app.get(
  "/api/rankings",
  async (req, res) => {

    try {

      const rankings =
        await Analysis.find()
          .sort({ atsScore: -1 })

      res.json(rankings)

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Ranking fetch failed"
      })

    }

  }
)

// stats
app.get(
  "/api/stats",
  async (req, res) => {

    try {

      const totalCandidates =
        await Candidate.countDocuments()

      const applied =
        await Candidate.countDocuments({
          status: "Applied"
        })

      const shortlisted =
        await Candidate.countDocuments({
          status: "Shortlisted"
        })

      const interviewScheduled =
        await Candidate.countDocuments({
          status: "Interview Scheduled"
        })

      const selected =
        await Candidate.countDocuments({
          status: "Selected"
        })

      const rejected =
        await Candidate.countDocuments({
          status: "Rejected"
        })

      res.json({
        totalCandidates,
        applied,
        shortlisted,
        interviewScheduled,
        selected,
        rejected
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Stats failed"
      })

    }

  }
)

// interview email
app.post(
  "/api/send-interview-email",
  async (req, res) => {

    try {

      const { email, name } = req.body

      await sendEmail(

        email,

        "Interview Invitation",

        `Hello ${name},

You have been shortlisted.

Interview details will be shared soon.

Regards,
MeruBot Recruitment Team`
      )

      res.json({
        message: "Email sent"
      })

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message: "Email failed"
      })

    }

  }
)

// download analysis
app.get("/api/download-analysis", async (req, res) => {

  try {

    const analysis = await Analysis.findOne().sort({ createdAt: -1 })

    if (!analysis) {

      return res.status(404).json({
        message: "No analysis found"
      })

    }

    const doc = new PDFDocument()

    res.setHeader(
      "Content-Type",
      "application/pdf"
    )

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ResumeAnalysis.pdf"
    )

    doc.pipe(res)

    doc.fontSize(24)
      .text("MeruBot AI Resume Analysis")

    doc.moveDown()

    doc.fontSize(18)
      .text(`Candidate: ${analysis.candidateName}`)

    doc.moveDown()

    doc.fontSize(12)
      .text(analysis.analysis)

    doc.end()

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "PDF Generation Failed"
    })

  }

})

// Save Recruiter Notes
app.put("/api/candidate/:id/notes", async (req, res) => {

  try {

    const { notes } = req.body

    const updatedCandidate = await Candidate.findByIdAndUpdate(

      req.params.id,

      { notes },

      { new: true }

    )

    res.json(updatedCandidate)

  } catch (error) {

    console.log(error)

    res.status(500).json({

      message: "Failed to save notes"

    })

  }

})

// Schedule Interview
app.put("/api/candidate/:id/interview", async (req, res) => {

  try {

    const { interviewDate, interviewTime } = req.body

    const updatedCandidate = await Candidate.findByIdAndUpdate(

      req.params.id,

      {

        interviewDate,

        interviewTime

      },

      {

        returnDocument: "after"

      }

    )

    res.json(updatedCandidate)

  } catch (error) {

    console.log(error)

    res.status(500).json({

      message: "Failed to schedule interview"

    })

  }

})

// Export Candidates to Excel
app.get("/api/export-excel", async (req, res) => {

  try {

    const candidates = await Candidate.find()

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet("Candidates")

    worksheet.columns = [

      { header: "Name", key: "name", width: 25 },

      { header: "Email", key: "email", width: 30 },

      { header: "Role", key: "role", width: 20 },

      { header: "Experience", key: "experience", width: 20 },

      { header: "Status", key: "status", width: 20 },

      { header: "Interview Date", key: "interviewDate", width: 20 },

      { header: "Interview Time", key: "interviewTime", width: 20 },

      { header: "Notes", key: "notes", width: 40 }

    ]

    candidates.forEach((candidate) => {

      worksheet.addRow({

        name: candidate.name,

        email: candidate.email,

        role: candidate.role,

        experience: candidate.experience,

        status: candidate.status,

        interviewDate: candidate.interviewDate,

        interviewTime: candidate.interviewTime,

        notes: candidate.notes

      })

    })

    res.setHeader(

      "Content-Type",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    )

    res.setHeader(

      "Content-Disposition",

      "attachment; filename=Candidates.xlsx"

    )

    await workbook.xlsx.write(res)

    res.end()

  } catch (error) {

    console.log(error)

    res.status(500).json({

      message: "Failed to export Excel"

    })

  }

})

// Get Single Candidate
app.get("/api/candidate/:id", async (req, res) => {

  try {

    const candidate = await Candidate.findById(req.params.id)

    if (!candidate) {

      return res.status(404).json({
        message: "Candidate not found"
      })

    }

    res.json(candidate)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server Error"
    })

  }

})

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000")
})