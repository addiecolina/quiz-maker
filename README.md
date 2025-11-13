# Quiz Maker

A complete full-stack quiz application with Node.js API and modern React client.

## Quick Start

### Installation

1. **Ensure Python 3 is installed and in PATH:**

   ```bash
   python --version
   # Should show Python 3.x.x
   ```

2. **Install dependencies:**

   ```bash
   # Client
   cd client
   npm install

   # Server
   cd server
   npm install
   ```

3. **Seed the database (first time only):**
   ```bash
   cd server
   npm run seed
   # This creates sample quiz data
   ```

## Running the Application

### Start the Server

```bash
cd server
npm start
```

The server will run on `http://localhost:4000`

### Start the Client

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

## What You Can Do

- **Create Quizzes** - Add multiple choice, short answer, and code questions
- **Take Quizzes** - Answer questions and get instant feedback
- **Grade Results** - See your score and correct answers

## Client Tech Stack

- **React 18** - Scaffold with Vite and TS
- **Tailwind CSS** - UI Library
- **React Router Dom** - Navigation
- **React Hook Form** - Form state management
- **Zod** - TS schema form validator
- **Tanstack Query** - Global state management

## Project Structure

```
src/
├── api.ts                    # API client
├── types.ts                  # TypeScript types
├── App.tsx                   # Main app
├── components/               # React components
│   ├── ErrorBoundary.tsx
│   └── forms/               # Form components
├── hooks/                    # React Query hooks
├── lib/                      # Utilities & validation
├── pages/                    # Page components
│   ├── LandingPage.tsx
│   ├── QuizzesPage.tsx
│   ├── QuizEditorPage.tsx
│   └── QuizAttemptPage.tsx
└── test/                     # Test setup
```

## How It Works

### Creating a Quiz

1. Go to "Quizzes" and click "Create Quiz"
2. Add quiz title and description
3. Click "Add Question" to create questions
4. Choose question type: Multiple Choice, Short Answer, or Code
5. Publish the quiz when ready

### Taking a Quiz

1. Click "Take a Quiz" on the landing page
2. Enter the quiz ID
3. Answer each question sequentially
4. Submit to see your results

### Minor Enhancements

1. Added a landing page for entry to create or take quiz
2. Added error logging in api.js (debugged to include code answer as string)
