#!/usr/bin/env node

/**
 * Alternative Seed Script - Works without better-sqlite3
 * This script creates a mock quiz data structure that can be used for testing
 * Run this if npm run seed fails due to better-sqlite3 build issues
 */

const fs = require("fs");
const path = require("path");

// Sample quiz data
const sampleQuizzes = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "A tiny quiz on core JS",
    time_limit_seconds: 300,
    is_published: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const sampleQuestions = [
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

// Create a JSON file as mock database
const mockDbPath = path.join(__dirname, "..", "mock-data.json");
const mockData = {
  quizzes: sampleQuizzes,
  questions: sampleQuestions,
  attempts: [],
  answers: [],
};

console.log("Creating mock database file...");
fs.writeFileSync(mockDbPath, JSON.stringify(mockData, null, 2));
console.log(`✓ Mock database created at: ${mockDbPath}`);

console.log("\n⚠️  This is a mock database for development purposes only.");
console.log("To use the real SQLite database:");
console.log("1. Install Visual Studio Build Tools");
console.log("2. Run: npm rebuild better-sqlite3");
console.log("3. Run: node src/seed.js\n");

console.log("Mock data created:");
console.log(`- ${sampleQuizzes.length} quiz(zes)`);
console.log(`- ${sampleQuestions.length} question(s)`);
console.log("\nServer can now start (in mock mode)");
console.log("Run: npm start");
