import { useState, useEffect, useCallback } from 'react';
import { auth, GameRepository } from '../infrastructure/FirebaseService';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { SimulationEngine, INITIAL_STATE } from '../domain/SimulationEngine';

export function useGameSession() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialisation de l'authentification anonyme
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Synchronisation avec Firestore
  useEffect(() => {
    if (!user) return;
    return GameRepository.subscribe(user.uid, (data) => {
      if (data) {
        setState(data);
      } else {
        GameRepository.save(user.uid, INITIAL_STATE);
      }
      setLoading(false);
    });
  }, [user]);

  // Action du joueur
  const playTurn = useCallback(async (effects) => {
    if (!user || !state) return;
    const next = SimulationEngine.processTurn(state, effects);
    await GameRepository.save(user.uid, next);
  }, [user, state]);

  // Réinitialisation
  const reset = useCallback(async () => {
    if (!user) return;
    await GameRepository.save(user.uid, INITIAL_STATE);
  }, [user]);

  return { state, loading, playTurn, reset };
}
