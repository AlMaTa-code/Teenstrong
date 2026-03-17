import { useState, useEffect, useCallback } from 'react';
import { saveProfile, loadProfile } from '../utils/storage';
import { buildProgram } from '../data/programBuilder';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      setProgram(buildProgram(saved));
    }
    setIsLoading(false);
  }, []);

  const createProfile = useCallback((data) => {
    const newProfile = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    saveProfile(newProfile);
    const prog = buildProgram(newProfile);
    setProgram(prog);
    return prog;
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(null);
    setProgram(null);
    localStorage.removeItem('kaldr_profile');
    localStorage.removeItem('kaldr_state');
  }, []);

  return { profile, program, isLoading, createProfile, resetProfile };
}
