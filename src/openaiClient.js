// src/openaiClient.js
import axios from 'axios';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openaiOrgId = process.env.REACT_APP_OPENAI_ORG_ID;

export const generateFinanceCaseStudy = async (difficulty) => {
  const prompt = `You are an expert finance interviewer. Create a ${difficulty} level finance or quantitative case study for a candidate applying to a finance/quant role. The case study should be challenging and relevant to current industry practices. Provide a detailed problem statement without solutions.`;
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
  const evaluationPrompt = `As an expert finance interviewer, generate specific evaluation criteria based on the following case study and assess the candidate's solution accordingly. Provide constructive feedback and a grade out of 100.\n\nCase Study:\n${caseStudy}\n\nCandidate's Solution:\n${userSolution}`;
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
