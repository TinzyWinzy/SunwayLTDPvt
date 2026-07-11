import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Product, Category, Order, Branch, UserProfile } from '../types/database'

function withId<T>(doc: DocumentData): T {
  return { id: doc.id, ...doc.data() } as T
}

export const API = {
  products: {
    async list(constraints: QueryConstraint[] = []) {
      const snap = await getDocs(query(collection(db, 'products'), ...constraints))
      return snap.docs.map((d) => withId<Product>(d))
    },

    async featured(count = 4) {
      return API.products.list([
        where('is_active', '==', true),
        orderBy('created_at', 'desc'),
        limit(count),
      ])
    },

    async getBySlug(slug: string) {
      const snap = await getDoc(doc(db, 'products', slug))
      return snap.exists() ? withId<Product>(snap) : null
    },

    async getByCategory(categoryId: string) {
      return API.products.list([
        where('category_id', '==', categoryId),
        where('is_active', '==', true),
        orderBy('created_at', 'desc'),
      ])
    },

    async create(data: Omit<Product, 'id' | 'created_at'>) {
      const ref = await addDoc(collection(db, 'products'), {
        ...data,
        created_at: serverTimestamp(),
      })
      return ref.id
    },

    async update(id: string, data: Partial<Product>) {
      await updateDoc(doc(db, 'products', id), data)
    },

    async delete(id: string) {
      await deleteDoc(doc(db, 'products', id))
    },
  },

  categories: {
    async list() {
      const snap = await getDocs(query(collection(db, 'categories'), orderBy('sort_order')))
      return snap.docs.map((d) => withId<Category>(d))
    },
  },

  branches: {
    async list() {
      const snap = await getDocs(query(collection(db, 'branches'), orderBy('city')))
      return snap.docs.map((d) => withId<Branch>(d))
    },
  },

  orders: {
    async list(constraints: QueryConstraint[] = []) {
      const snap = await getDocs(query(collection(db, 'orders'), ...constraints))
      return snap.docs.map((d) => withId<Order>(d))
    },

    async getByUser(userId: string) {
      return API.orders.list([
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
      ])
    },

    async getById(id: string) {
      const snap = await getDoc(doc(db, 'orders', id))
      return snap.exists() ? withId<Order>(snap) : null
    },

    async create(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
      const ref = await addDoc(collection(db, 'orders'), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })
      return ref.id
    },

    async update(id: string, data: Partial<Order>) {
      await updateDoc(doc(db, 'orders', id), {
        ...data,
        updated_at: serverTimestamp(),
      })
    },
  },

  users: {
    async getProfile(userId: string) {
      const snap = await getDoc(doc(db, 'users', userId))
      return snap.exists() ? withId<UserProfile>(snap) : null
    },
  },
}
