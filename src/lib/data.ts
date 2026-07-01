import crypto from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { defaultPortfolio } from '@/data/defaultPortfolio';
import type { Inquiry, PortfolioData } from '@/types';
import { getAdminDb } from './firebaseAdmin';

const portfolioCollection = 'portfolio';
const portfolioDocId = 'sayem-profile';
const inquiriesCollection = 'inquiries';

let memoryPortfolio: PortfolioData = defaultPortfolio;
let memoryInquiries: Inquiry[] = [];

function cleanText(value: unknown, fallback = '', max = 3000) {
  return String(value || fallback)
    .trim()
    .slice(0, max);
}

export async function getPortfolio(): Promise<PortfolioData> {
  const db = getAdminDb();

  if (!db) {
    return memoryPortfolio;
  }

  const ref = db.collection(portfolioCollection).doc(portfolioDocId);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set(defaultPortfolio);
    return defaultPortfolio;
  }

  return snap.data() as PortfolioData;
}

export async function savePortfolio(portfolio: PortfolioData) {
  memoryPortfolio = portfolio;

  const db = getAdminDb();

  if (!db) {
    return;
  }

  await db.collection(portfolioCollection).doc(portfolioDocId).set({
    ...portfolio,
    updatedAt: FieldValue.serverTimestamp()
  });
}

export async function createInquiry(input: Partial<Inquiry>) {
  const inquiry: Inquiry = {
    id: `inq_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
    name: cleanText(input.name, '', 100),
    email: cleanText(input.email, '', 120),
    subject: cleanText(input.subject, 'General Inquiry', 150),
    budget: cleanText(input.budget, 'Not specified', 100),
    message: cleanText(input.message, '', 3000),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  memoryInquiries = [inquiry, ...memoryInquiries];

  const db = getAdminDb();

  if (db) {
    await db.collection(inquiriesCollection).doc(inquiry.id).set(inquiry);
  }

  return inquiry;
}

export async function getInquiries() {
  const db = getAdminDb();

  if (!db) {
    return memoryInquiries;
  }

  const snap = await db
    .collection(inquiriesCollection)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map((doc) => doc.data() as Inquiry);
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']) {
  memoryInquiries = memoryInquiries.map((item) =>
    item.id === id ? { ...item, status } : item
  );

  const db = getAdminDb();

  if (!db) {
    return true;
  }

  const ref = db.collection(inquiriesCollection).doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    return false;
  }

  await ref.update({ status });
  return true;
}

export async function deleteInquiry(id: string) {
  const before = memoryInquiries.length;
  memoryInquiries = memoryInquiries.filter((item) => item.id !== id);

  const db = getAdminDb();

  if (!db) {
    return before !== memoryInquiries.length || true;
  }

  const ref = db.collection(inquiriesCollection).doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    return false;
  }

  await ref.delete();
  return true;
}
