import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Remplace ceci par ta vraie configuration Firebase de ton projet web


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const APP_ID = 'aethelgard-local-dev';

export const GameRepository = {
  getRef: (uid) => doc(db, 'artifacts', APP_ID, 'users', uid, 'state', 'current'),
  
  async save(uid, state) {
    if (uid) await setDoc(GameRepository.getRef(uid), state); // On remplace this par GameRepository
  },
  
  subscribe: (uid, callback, onError) => {
    return onSnapshot(
      GameRepository.getRef(uid),
      (snap) => callback(snap.exists() ? snap.data() : null),
      onError
    );
  }
};