import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Event } from '../types/Event';

const EVENTS_COLLECTION = 'events';

export const eventService = {
  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newEvent = {
      ...event,
      start: Timestamp.fromDate(new Date(event.start)),
      end: event.end ? Timestamp.fromDate(new Date(event.end)) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), newEvent);
    return docRef.id;
  },

  async getEvents(): Promise<Event[]> {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('start', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        start: data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start),
        end: data.end instanceof Timestamp ? data.end.toDate() : data.end ? new Date(data.end) : null,
        allDay: data.allDay,
        type: data.type,
        createdBy: data.createdBy,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    });
  },

  async updateEvent(id: string, event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(eventRef, {
      ...event,
      start: event.start ? Timestamp.fromDate(new Date(event.start)) : null,
      end: event.end ? Timestamp.fromDate(new Date(event.end)) : null,
      updatedAt: Timestamp.now()
    });
  },

  async deleteEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, EVENTS_COLLECTION, id));
  }
};
