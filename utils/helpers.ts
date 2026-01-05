import { User, Contact, TimeZoneInfo } from '../types';
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';

// Generate a unique 6-character share code
export const generateShareCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Get timezone info for a given timezone string
export const getTimezoneInfo = (timezone: string): TimeZoneInfo => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const timeString = formatter.format(now);
  const offset = getTimezoneOffset(timezone);
  
  return {
    timezone,
    offset,
    currentTime: now,
    displayName: timezone.replace(/_/g, ' '),
  };
};

// Get timezone offset in hours
const getTimezoneOffset = (timezone: string): number => {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', { timeZone: timezone });
  const tzDate = new Date(tzString);
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
};

// Firebase Database Operations

export const createUserProfile = async (userId: string, email: string, timezone: string): Promise<void> => {
  const shareCode = generateShareCode();
  const userRef = doc(db, 'users', userId);
  
  await setDoc(userRef, {
    email,
    timezone,
    shareCode,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      id: userSnap.id,
      email: data.email,
      displayName: data.displayName,
      timezone: data.timezone,
      shareCode: data.shareCode,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
  
  return null;
};

export const updateUserTimezone = async (userId: string, timezone: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    timezone,
    updatedAt: Timestamp.now(),
  });
};

export const getUserByShareCode = async (shareCode: string): Promise<User | null> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('shareCode', '==', shareCode));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email,
      displayName: data.displayName,
      timezone: data.timezone,
      shareCode: data.shareCode,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
  
  return null;
};

export const addContact = async (userId: string, contactUser: User): Promise<void> => {
  const contactRef = doc(collection(db, 'contacts'));
  
  await setDoc(contactRef, {
    userId,
    contactUserId: contactUser.id,
    contactEmail: contactUser.email,
    contactDisplayName: contactUser.displayName,
    contactTimezone: contactUser.timezone,
    addedAt: Timestamp.now(),
  });
};

export const getContacts = async (userId: string): Promise<Contact[]> => {
  const contactsRef = collection(db, 'contacts');
  const q = query(contactsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      contactUserId: data.contactUserId,
      contactEmail: data.contactEmail,
      contactDisplayName: data.contactDisplayName,
      contactTimezone: data.contactTimezone,
      addedAt: data.addedAt.toDate(),
    };
  });
};

export const deleteContact = async (contactId: string): Promise<void> => {
  const contactRef = doc(db, 'contacts', contactId);
  await deleteDoc(contactRef);
};

// Format time for display
export const formatTime = (date: Date, timezone: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatDate = (date: Date, timezone: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

