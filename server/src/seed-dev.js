#!/usr/bin/env node

/**
 * Seed Script - Works without better-sqlite3
 * This creates a starter database JSON file that the app can use
 *
 * Once better-sqlite3 is properly built, run the real seed.js
 */

const fs = require("fs");
const path = require("path");

console.log("🌱 Creating seed data...\n");

// Sample quiz data
const quizzes = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "A quick quiz on core JavaScript concepts",
    time_limit_seconds: 300,
    is_published: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Sample questions
const questions = [
  {
    id: 1,
    quiz_id: 1,
    type: "mcq",
    prompt: "Which of the following is NOT a primitive type in JavaScript?",
    options_json: JSON.stringify(["string", "number", "boolean", "array"]),
    correct_answer: "3",
    position: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    quiz_id: 1,
    type: "short",
    prompt: "What keyword declares a block-scoped variable introduced in ES6?",
    options_json: null,
    correct_answer: "let",
    position: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    quiz_id: 1,
    type: "code",
    prompt: "Write a function `sum(a,b)` that returns a + b.",
    options_json: null,
    correct_answer: null,
    position: 2,
    created_at: new Date().toISOString(),
  },
];

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write seed data as JSON files (for development without better-sqlite3)
const seedData = {
  quizzes,
  questions,
  attempts: [],
  attempt_answers: [],
};

const seedFile = path.join(dataDir, "seed.json");
fs.writeFileSync(seedFile, JSON.stringify(seedData, null, 2));

console.log("✅ Seed data created at: data/seed.json\n");
console.log(`📊 Sample data:`);
console.log(`   - 1 Quiz: "${quizzes[0].title}"`);
console.log(`   - 3 Questions (MCQ, Short Answer, Code)`);
console.log(
  `\n⚠️  This is development-mode seeding without the real database.`
);
console.log(`\nTo use the real SQLite database:`);
console.log(`1. Install Visual Studio Build Tools (C++ development)`);
console.log(`2. Run: npm rebuild better-sqlite3`);
console.log(`3. Run: node src/seed.js\n`);
console.log(`For now, you can:`);
console.log(`- Run frontend: cd ../client && npm run dev`);
console.log(`- Frontend tests: npm test`);
console.log(`- Frontend build: npm run build\n`);
