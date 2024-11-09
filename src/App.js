// src/App.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup.js';
import Login from './components/Login';
import CaseStudyGenerator from './components/CaseStudyGenerator';
import PreviousExercises from './components/PreviousExercises';
import { AnimatedBackground } from 'animated-backgrounds';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <AnimatedBackground animationName="auroraBorealis" />
      {session ? (
        <>
          <nav>
            <Link to="/">Practice</Link> | <Link to="/previous">Previous Exercises</Link> |{' '}
            <button onClick={() => supabase.auth.signOut()}>Log Out</button>
          </nav>
          <Routes>
            <Route path="/" element={<CaseStudyGenerator />} />
            <Route path="/previous" element={<PreviousExercises />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
