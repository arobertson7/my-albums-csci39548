import { type Album } from './types.ts'

const API_BASE = 'http://localhost:3001';

export async function fetchItems(): Promise<Album[]> {
  const response = await fetch(`${API_BASE}/items`);
  if (!response.ok) {
    throw new Error('Failed to fetch albums');
  }
  return response.json();
}

export async function fetchItem(id: number | string): Promise<Album> {
  const response = await fetch(`${API_BASE}/items/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch album');
  }
  return response.json();
}

export async function updateItem(
  id: number | string,
  updates: Partial<Pick<Album, 'status' | 'rating' | 'note'>>
): Promise<Album> {
  const response = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update album');
  }
  return response.json();
}
