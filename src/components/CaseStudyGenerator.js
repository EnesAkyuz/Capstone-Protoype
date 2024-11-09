// src/components/CaseStudyGenerator.js
import React, { useState } from 'react';
import { generateFinanceCaseStudy, evaluateFinanceCaseStudy } from '../openaiClient';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function CaseStudyGenerator() {
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [education, setEducation] = useState('Bachelors');
  const [jobDescription, setJobDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [caseStudy, setCaseStudy] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateFinanceCaseStudy(difficulty);
      if (data && data.choices && data.choices[0]) {
        setCaseStudy(data.choices[0].message.content.trim());
        setUserSolution('');
        setEvaluation('');
      } else {
        alert('Error: Received unexpected response from the generation API.');
        console.error('Generation response:', data);
      }
    } catch (error) {
      alert('Error generating case study.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleEvaluate = async () => {
    if (!userSolution.trim()) {
      alert('Please enter your solution.');
      return;
    }
    setLoading(true);
    try {
      const data = await evaluateFinanceCaseStudy(userSolution, caseStudy);
      if (data && data.choices && data.choices[0]) {
        const evaluationText = data.choices[0].message.content.trim();
        setEvaluation(evaluationText);
        await saveToDatabase(evaluationText);
      } else {
        alert('Error: Received unexpected response from the evaluation API.');
        console.error('Evaluation response:', data);
      }
    } catch (error) {
      alert('Error evaluating your solution.');
      console.error(error);
    }
    setLoading(false);
  };

  const saveToDatabase = async (evaluationText) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('Error fetching user data');
      console.error('User error:', userError);
      return;
    }

    const { data, error } = await supabase.from('case_studies').insert([
      {
        user_id: user.id,
        difficulty,
        case_study: caseStudy,
        user_solution: userSolution,
        evaluation: evaluationText,
      },
    ]);

    if (error) {
      alert('Error saving to database: ' + error.message);
      console.error('Database insert error:', error);
    } else {
      console.log('Data saved successfully:', data);
    }
  };

  return (
    <div className="container">
      <h2>Finance & Quant Interview Practice</h2>
      <div className="form-group">
        <label>
          Education Level:
          <select value={education} onChange={(e) => setEducation(e.target.value)}>
            <option value="Bachelors">Bachelor's Degree</option>
            <option value="Masters">Master's Degree</option>
            <option value="PhD">PhD</option>
            <option value="MBA">MBA</option>
          </select>
        </label>
        
        <label>
          Difficulty Level:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <label>
          Job Description:
          <textarea
            placeholder="Paste the job description you're applying for..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="3"
          ></textarea>
        </label>

        <label>
          Specific Topic (optional):
          <input
            type="text"
            placeholder="e.g., Options Pricing, Risk Management, etc."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </label>
        
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Case Study'}
        </button>
      </div>
      {caseStudy && (
        <div className="content-section">
          <div className="case-study-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{caseStudy}</ReactMarkdown>
          </div>
          <textarea
            placeholder="Enter your solution here..."
            value={userSolution}
            onChange={(e) => setUserSolution(e.target.value)}
            rows="10"
            cols="50"
          ></textarea>
          <button onClick={handleEvaluate} disabled={loading || evaluation}>
            {loading ? 'Evaluating...' : evaluation ? 'Evaluation Complete' : 'Submit Solution for Evaluation'}
          </button>
        </div>
      )}
      {evaluation && (
        <div className="content-section">
          <div className="evaluation-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{evaluation}</ReactMarkdown>
          </div>
          <p className="success-message">Your solution and evaluation have been saved.</p>
        </div>
      )}
      <div>
        <a href="/previous">View Previous Exercises</a>
      </div>
    </div>
  );
}

export default CaseStudyGenerator;
