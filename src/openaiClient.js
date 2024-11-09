// src/openaiClient.js
import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openaiOrgId = process.env.REACT_APP_OPENAI_ORG_ID;

export const generateFinanceCaseStudy = async (difficulty, education, jobDescription, topic) => {
  const prompt = `As an expert finance interviewer, create a detailed ${difficulty} level finance or quantitative case study for a candidate with a ${education} degree applying for the following position:

${jobDescription}

${topic ? `The case study should focus on: ${topic}` : ''}

Requirements:
1. Create a comprehensive case study with realistic financial data and numbers
2. Include multiple data points, market statistics, and financial metrics
3. Make it challenging and relevant to the job description
4. Include at least 3-4 paragraphs of background information
5. Provide detailed numerical examples and scenarios
6. Include tables or data points where relevant
7. Match the technical complexity to the education level
8. Make it industry-specific and practical

Output Format (use markdown):

# [Write an engaging title]

## Background
[Write 3-4 detailed paragraphs about the company/situation, including:
- Industry context
- Market position
- Key financial metrics
- Current challenges]

## Market Data
| Metric | Value | Industry Average |
|--------|--------|-----------------|
| Market Size | [value] | [value] |
| Growth Rate | [value] | [value] |
| Market Share | [value] | [value] |
| Key Ratios | [value] | [value] |

## Problem Statement
[Write a detailed problem statement with specific numbers and metrics to analyze]

## Key Considerations
- [Point 1 with specific metrics]
- [Point 2 with market data]
- [Point 3 with financial implications]
- [Point 4 with risk factors]

## Questions
1. [Detailed quantitative question with specific numbers]
2. [Strategic analysis question with financial implications]
3. [Technical question related to the topic]
4. [Risk assessment question]

## Additional Information
[Provide relevant financial data, market statistics, and any assumptions to be used]

Note: Make the case study complex enough for a ${education} level candidate, include realistic numbers, and ensure all data points are consistent throughout the case study.`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
          'OpenAI-Organization': openaiOrgId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating finance case study:', error);
    throw error;
  }
};

export const evaluateFinanceCaseStudy = async (userSolution, caseStudy) => {
  const evaluationPrompt = `As an expert finance interviewer, evaluate the following case study solution using these strict criteria:

Case Study:
${caseStudy}

Candidate's Solution:
${userSolution}

Evaluation Criteria:
1. Problem Understanding (20 points)
2. Technical Accuracy (30 points)
3. Analytical Approach (25 points)
4. Communication Clarity (15 points)
5. Innovation/Creativity (10 points)

Rules:
- Start with 0 points and add points for correct elements
- Require specific technical explanations for points
- Maximum score should be 100
- Be extremely critical and detailed
- Score below 50 if the solution is completely off-track
- Score below 30 if the solution is irrelevant or shows no understanding
- Score below 10 if the answer is nonsensical

Output Format:
## Detailed Evaluation
[Provide specific feedback for each criterion]

## Scoring Breakdown
- Problem Understanding: [X/20]
- Technical Accuracy: [X/30]
- Analytical Approach: [X/25]
- Communication Clarity: [X/15]
- Innovation/Creativity: [X/10]

## Total Score: [X/100]

## Recommendations for Improvement
[Specific areas to focus on]`;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: evaluationPrompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
          'OpenAI-Organization': openaiOrgId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error evaluating finance case study:', error.response ? error.response.data : error);
    throw error;
  }
};
