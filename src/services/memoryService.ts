import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Memory, Comment } from '../types/Memory';

const MEMORIES_COLLECTION = 'memories';

export const memoryService = {
  async createMemory(text: string, authorId: string, authorName: string): Promise<string> {
    const newMemory = {
      text,
      authorId,
      authorName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: [],
      comments: []
    };

    const docRef = await addDoc(collection(db, MEMORIES_COLLECTION), newMemory);
    return docRef.id;
  },

  async getMemories(): Promise<Memory[]> {
    const q = query(
      collection(db, MEMORIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        comments: data.comments.map((comment: any) => ({
          ...comment,
          createdAt: comment.createdAt instanceof Timestamp ? comment.createdAt.toDate() : new Date(comment.createdAt)
        }))
      } as Memory;
    });
  },

  async updateMemory(id: string, text: string): Promise<void> {
    const memoryRef = doc(db, MEMORIES_COLLECTION, id);
    await updateDoc(memoryRef, {
      text,
      updatedAt: Timestamp.now()
    });
  },

  async deleteMemory(id: string): Promise<void> {
    await deleteDoc(doc(db, MEMORIES_COLLECTION, id));
  },

  async toggleLike(memoryId: string, userId: string): Promise<void> {
    const memoryRef = doc(db, MEMORIES_COLLECTION, memoryId);
    const memoryDoc = await getDocs(query(collection(db, MEMORIES_COLLECTION)));
    const memory = memoryDoc.docs.find(doc => doc.id === memoryId);

    if (memory) {
      const likes = memory.data().likes || [];
      const newLikes = likes.includes(userId)
        ? likes.filter((id: string) => id !== userId)
        : [...likes, userId];

      await updateDoc(memoryRef, { likes: newLikes });
    }
  },

  async addComment(memoryId: string, text: string, authorId: string, authorName: string): Promise<void> {
    const memoryRef = doc(db, MEMORIES_COLLECTION, memoryId);
    const memoryDoc = await getDocs(query(collection(db, MEMORIES_COLLECTION)));
    const memory = memoryDoc.docs.find(doc => doc.id === memoryId);

    if (memory) {
      const comments = memory.data().comments || [];
      const newComment: Comment = {
        id: Date.now().toString(),
        text,
        createdAt: Timestamp.now(),
        authorId,
        authorName
      };

      await updateDoc(memoryRef, {
        comments: [...comments, newComment]
      });
    }
  }
};
