// src/components/PreviousExercises.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function PreviousExercises() {
  const [exercises, setExercises] = useState([]);

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

  return (
    <div className="container">
      <h2>Your Previous Exercises</h2>
      {exercises.length > 0 ? (
        exercises.map((exercise) => (
          <div key={exercise.id} className="exercise">
            <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
            <p><strong>Case Study:</strong> {exercise.case_study}</p>
            <p><strong>Your Solution:</strong> {exercise.user_solution}</p>
            <p><strong>Evaluation:</strong> {exercise.evaluation}</p>
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
