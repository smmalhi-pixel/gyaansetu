const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
const serverCache = {};

const chapters = require('./chapters-data.json');

const client = new OpenAI({
  apiKey: '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',
  baseURL: "https://api.groq.com/openai/v1"
});

const SYSTEM_PROMPT = `You are "Gyaan Guru", a strict but friendly tutor for Indian students (Classes 8-12, CBSE & ICSE). Rules: NEVER give direct answers. Use the Socratic method. Default to Hinglish. Use "aap", "beta", "socho". End with "Samajh aaya? Aage badhein?"`;

// Chapters API
app.get('/api/chapters/:board/:classLevel', (req, res) => {
  console.log("Params:", req.params);
  const { board, classLevel } = req.params;
  console.log("Looking for:", board, classLevel);
  const data = chapters[board]?.[classLevel];
  console.log("Found:", data ? Object.keys(data) : 'nothing');
  if (data) res.json(data);
  else res.status(404).json({ error: 'Not found' });
});

// Lecture Generator API
app.post('/api/lecture/generate', async (req, res) => {
  try {
    const { chapter, subject, board, classLevel } = req.body;
    const cacheKey = `lecture_${board}_${classLevel}_${subject}_${chapter}`;
    
    if (serverCache[cacheKey]) {
      console.log('Serving from cache:', cacheKey);
      return res.json(serverCache[cacheKey]);
    }
    const lecturePrompt = `You are "Gyaan Guru", an expert tutor for Indian students (${board} Class ${classLevel}). Create a detailed, engaging lecture on the chapter "${chapter}" from ${subject}. Format your response EXACTLY as JSON with this structure: { "title": "Chapter title", "subject": "${subject}", "duration": "estimated minutes to read", "slides": [{ "heading": "Slide heading", "content": "Detailed explanation in Hinglish. Use simple language, relatable examples, and emojis. Keep it under 100 words.", "keyPoint": "One key takeaway from this slide" }], "summary": "5 bullet points summarizing the chapter", "practiceQuestions": [{ "question": "A conceptual question", "hint": "A small hint to solve it" }] }. Rules: Use Hinglish, include 5-7 slides, include 3 practice questions, return ONLY valid JSON, no other text.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are an educational content generator. Always respond with valid JSON only." }, { role: "user", content: lecturePrompt }],
      max_tokens: 2000, temperature: 0.7,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const lecture = JSON.parse(cleanResponse);
    serverCache[cacheKey] = lecture;
    res.json(lecture);
  } catch (error) { console.error("Lecture generation error:", error); res.status(500).json({ error: "Failed to generate lecture: " + error.message }); }
});

// Chapter Test API
app.post('/api/test/generate', async (req, res) => {
  try {
    const { chapter, subject, board, classLevel } = req.body;
    const cacheKey = `test_${board}_${classLevel}_${subject}_${chapter}`;
    if (serverCache[cacheKey]) {
      console.log('Serving test from cache');
      return res.json(serverCache[cacheKey]);
    }
    const testPrompt = `You are an exam creator for Indian students (${board} Class ${classLevel}). Create a test for the chapter "${chapter}" from ${subject}. Generate 10 multiple choice questions. Return ONLY valid JSON with this exact structure: { "title": "Test: chapter name", "subject": "${subject}", "timeMinutes": 15, "totalMarks": 40, "questions": [{ "id": 1, "question": "Question text in Hinglish", "options": ["A", "B", "C", "D"], "correct": 0, "marks": 4, "explanation": "Short explanation" }] }. Rules: 10 questions, 4 marks each, correct answer index 0-3, mix of difficulty, use Hinglish, return ONLY JSON.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a test generator. Always respond with valid JSON only." }, { role: "user", content: testPrompt }],
      max_tokens: 2000, temperature: 0.7,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const test = JSON.parse(cleanResponse);
    serverCache[cacheKey] = test;
    res.json(test);
  } catch (error) { console.error("Test generation error:", error); res.status(500).json({ error: "Failed to generate test: " + error.message }); }
});

// Formula Sheet API
app.post('/api/formulas/generate', async (req, res) => {
  try {
    const { subject, board, classLevel } = req.body;
    const cacheKey = `formulas_${board}_${classLevel}_${subject}`;
    if (serverCache[cacheKey]) return res.json(serverCache[cacheKey]);
    const formulaPrompt = `You are an expert teacher for Indian students (${board} Class ${classLevel}). Create a complete formula sheet for ${subject}. Return ONLY valid JSON with this exact structure: { "subject": "${subject}", "board": "${board}", "class": "${classLevel}", "chapters": [{ "chapterName": "Name", "formulas": [{ "name": "Formula name", "formula": "The formula", "description": "When to use (Hinglish)", "example": "Quick example" }] }] }. Rules: Include ALL chapters, 3-6 formulas per chapter, use Hinglish, return ONLY JSON.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a formula sheet generator. Always respond with valid JSON only." }, { role: "user", content: formulaPrompt }],
      max_tokens: 2500, temperature: 0.5,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const formulas = JSON.parse(cleanResponse);
    serverCache[cacheKey] = formulas;
    res.json(formulas);
  } catch (error) { console.error("Formula generation error:", error); res.status(500).json({ error: "Failed to generate formulas: " + error.message }); }
});

// Chapter Summary API
app.post('/api/summary/generate', async (req, res) => {
  try {
    const { chapter, subject, board, classLevel } = req.body;
    const cacheKey = `summary_${board}_${classLevel}_${subject}_${chapter}`;
    if (serverCache[cacheKey]) {
      console.log('Serving summary from cache');
      return res.json(serverCache[cacheKey]);
    }
    const summaryPrompt = `You are "Gyaan Guru", an expert tutor for Indian students (${board} Class ${classLevel}). Create a concise summary of the chapter "${chapter}" from ${subject}. Return ONLY valid JSON: { "title": "Chapter title", "subject": "${subject}", "keyPoints": ["5-7 key points in Hinglish"], "importantDefinitions": [{ "term": "Term", "definition": "Simple definition in Hinglish" }], "quickRecap": "3-4 line summary in Hinglish under 50 words", "commonMistakes": ["2-3 common mistakes"] }. Return ONLY JSON.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a study material generator. Always respond with valid JSON only." }, { role: "user", content: summaryPrompt }],
      max_tokens: 1500, temperature: 0.5,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const summary = JSON.parse(cleanResponse);
    serverCache[cacheKey] = summary;
    res.json(summary);
  } catch (error) { console.error("Summary generation error:", error); res.status(500).json({ error: "Failed to generate summary: " + error.message }); }
});

// Smart Revision API
app.post('/api/revision/suggest', async (req, res) => {
  try {
    const { subject, board, classLevel, weakChapters } = req.body;
    const cacheKey = `revision_${board}_${classLevel}_${subject}`;
    if (serverCache[cacheKey]) return res.json(serverCache[cacheKey]);
    const revisionPrompt = `You are a study advisor for an Indian student (${board} Class ${classLevel}). The student is weak in these chapters of ${subject}: ${weakChapters.join(', ')}. Create a revision plan. Return ONLY valid JSON: { "subject": "${subject}", "focusAreas": ["3 important topics"], "revisionPlan": [{ "chapter": "Chapter name", "whyImportant": "1 line in Hinglish", "keyTopics": ["2-3 topics"], "quickTip": "One tip in Hinglish", "estimatedTime": "30 mins" }], "motivation": "One line in Hinglish" }. Return ONLY JSON.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a study advisor. Always respond with valid JSON only." }, { role: "user", content: revisionPrompt }],
      max_tokens: 1500, temperature: 0.7,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const revision = JSON.parse(cleanResponse);
    serverCache[cacheKey] = revision;
    res.json(revision);
  } catch (error) { console.error("Revision generation error:", error); res.status(500).json({ error: "Failed to generate revision plan: " + error.message }); }
});

// Study Plan API
app.post('/api/studyplan/generate', async (req, res) => {
  try {
    const { subjects, board, classLevel, daysUntilExam } = req.body;
    const cacheKey = `plan_${board}_${classLevel}_${subjects.sort().join(',')}_${daysUntilExam}`;
    if (serverCache[cacheKey]) return res.json(serverCache[cacheKey]);
    const planPrompt = `You are an expert study planner for Indian students (${board} Class ${classLevel}). Student has ${daysUntilExam} days until exam. Subjects: ${subjects.join(', ')}. Create a day-by-day plan. Return ONLY valid JSON: { "title": "Study Plan", "daysUntilExam": ${daysUntilExam}, "dailySchedule": [{ "day": 1, "focus": "Subject", "chapters": ["Ch1", "Ch2"], "tasks": ["Task 1"], "tip": "Tip in Hinglish", "duration": "2 hours" }], "examTips": ["3 tips in Hinglish"], "motivation": "One line in Hinglish" }. Return ONLY JSON.`;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a study planner. Always respond with valid JSON only." }, { role: "user", content: planPrompt }],
      max_tokens: 2500, temperature: 0.7,
    });
    let response = ''; response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const plan = JSON.parse(cleanResponse);
    serverCache[cacheKey] = plan;
    res.json(plan);
  } catch (error) { console.error("Study plan generation error:", error); res.status(500).json({ error: "Failed to generate study plan: " + error.message }); }
});

// YouTube Search API
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { query } = req.query;
    const YOUTUBE_KEY = 'AIzaSyAS826vzdvmVw_opxBkf1WPg-Jkef_2SQA';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${YOUTUBE_KEY}`;
    console.log('YouTube API called');
    const response = await fetch(url);
    const data = await response.json();
    console.log('YouTube results:', data.items?.length || 0);
    const videos = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url
    }));
    res.json(videos);
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Essay Writer API
app.post('/api/essay/generate', async (req, res) => {
  try {
    const { topic, board, classLevel, type, wordCount } = req.body;
    
    const essayPrompt = `You are an expert essay writer for Indian students (${board} Class ${classLevel}).
Write a ${type || 'descriptive'} essay on "${topic}" in about ${wordCount || 300} words.

Return ONLY valid JSON with this structure:
{
  "title": "Essay title",
  "topic": "${topic}",
  "type": "${type || 'descriptive'}",
  "content": "The full essay text with paragraphs separated by newlines",
  "keyPoints": ["3 key points from the essay"],
  "wordCount": number
}

Rules:
- Write in clear English suitable for ${board} Class ${classLevel}
- Include an introduction, body paragraphs, and conclusion
- Use simple but impactful language
- Include relevant examples
- Return ONLY valid JSON, no other text`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert essay writer. Always respond with valid JSON only." },
        { role: "user", content: essayPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    let response = '';
    response = completion.choices[0].message.content;
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const essay = JSON.parse(cleanResponse);
    res.json(essay);
  } catch (error) {
    console.error("Essay generation error:", error);
    res.status(500).json({ error: "Failed to generate essay: " + error.message });
  }
});

// Doubt Solver API
app.post('/api/doubt/solve', async (req, res) => {
  try {
    const { question, board, classLevel } = req.body;
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: `Board: ${board}, Class: ${classLevel}. Doubt: ${question}` }],
      max_tokens: 300,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) { res.status(500).json({ reply: "Error: " + error.message }); }
});

app.listen(5000, () => console.log('Server running on port 5000'));