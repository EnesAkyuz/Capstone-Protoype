// src/components/PreviousExercises.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function PreviousExercises() {
  const [exercises, setExercises] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExercises = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('Error fetching user data');
      return;
    }

    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) alert(error.message);
    else setExercises(data);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container">
      <h2>Your Previous Exercises</h2>
      {exercises.length > 0 ? (
        exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <div 
              className="exercise-header" 
              onClick={() => toggleExpand(exercise.id)}
            >
              <h3>{exercise.difficulty} Level Case Study</h3>
              <span className="expand-icon">
                {expandedId === exercise.id ? '▼' : '▶'}
              </span>
            </div>
            {expandedId === exercise.id && (
              <div className="exercise-content">
                <div className="case-study-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.case_study}</ReactMarkdown>
                </div>
                <div className="solution-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.user_solution}</ReactMarkdown>
                </div>
                <div className="evaluation-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{exercise.evaluation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No exercises found.</p>
      )}
      <div>
        <a href="/">Back to Practice</a>
      </div>
    </div>
  );
}

export default PreviousExercises;
