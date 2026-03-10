import { collection, getDocs, query, where, doc, addDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase'; 
import type { Vote, Phone, Expert, HeuristicVote } from '../types/index';
import { INITIAL_PHONES, INITIAL_EXPERTS } from '../data/mockData';

class VotingService {
  private votesCollection = collection(db, 'votes');
  private phonesCollection = collection(db, 'phones');
  private expertsCollection = collection(db, 'experts');
  private heuristicVotesCollection = collection(db, 'heuristicVotes');

  async loginOrRegisterExpert(name: string): Promise<Expert> {
    const trimmedName = name.trim();
    const q = query(this.expertsCollection, where("name", "==", trimmedName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as Expert;
    }

    const docRef = await addDoc(this.expertsCollection, { name: trimmedName, isTeacher: false });
    return { id: docRef.id, name: trimmedName, isTeacher: false };
  }

  async getPhones(): Promise<Phone[]> {
    const snapshot = await getDocs(this.phonesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Phone));
  }

  async getExperts(): Promise<Expert[]> {
    const snapshot = await getDocs(this.expertsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expert));
  }

  async submitVote(vote: Vote): Promise<void> {
    const q = query(this.votesCollection, where("expertId", "==", vote.expertId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error('Ви вже проголосували на першому етапі!');
    await addDoc(this.votesCollection, vote);
  }

  async getAllVotes(): Promise<Vote[]> {
    const snapshot = await getDocs(this.votesCollection);
    return snapshot.docs.map(doc => doc.data() as Vote);
  }

  async submitHeuristicVote(vote: HeuristicVote): Promise<void> {
    const q = query(this.heuristicVotesCollection, where("expertId", "==", vote.expertId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error('Ви вже проголосували за евристики!');
    await addDoc(this.heuristicVotesCollection, vote);
  }

  async getAllHeuristicVotes(): Promise<HeuristicVote[]> {
    const snapshot = await getDocs(this.heuristicVotesCollection);
    return snapshot.docs.map(doc => doc.data() as HeuristicVote);
  }

  async seedDatabase(): Promise<void> {
    const batch = writeBatch(db);
    INITIAL_PHONES.forEach(phone => {
      const phoneRef = doc(this.phonesCollection, phone.id);
      batch.set(phoneRef, { brand: phone.brand, model: phone.model, photo: phone.photo });
    });
    INITIAL_EXPERTS.forEach(expert => {
      const expertRef = doc(this.expertsCollection, expert.id);
      batch.set(expertRef, { name: expert.name, isTeacher: expert.isTeacher || false });
    });
    await batch.commit();
  }
}

export const votingService = new VotingService();