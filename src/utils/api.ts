import { AppStateData } from '../types';
import { INITIAL_DATA } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'my_love_app_data_v1';
const ADMIN_TOKEN_KEY = 'my_love_admin_token';

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export async function fetchAppData(): Promise<AppStateData> {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/data not reachable, using cached or initial data', err);
  }

  // Fallback to local storage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return INITIAL_DATA;
}

export async function verifyAdminPassword(password: string, username: string = 'Bundau'): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const json = await res.json();
      setStoredAdminToken(json.token || 'admin-authorized-token');
      return true;
    }
    return false;
  } catch (err) {
    // If backend isn't reachable, test against Bundau / Mue1609
    const normUser = (username || 'Bundau').trim().toLowerCase();
    if (normUser === 'bundau' && password === 'Mue1609') {
      setStoredAdminToken('admin-authorized-token');
      return true;
    }
    return false;
  }
}

export async function apiUpdateCover(coverData: {
  coverImage?: string;
  coverTitle?: string;
  coverSubtitle?: string;
}): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch('/api/cover', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(coverData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể cập nhật ảnh bìa' }));
    throw new Error(err.error || 'Lỗi khi cập nhật ảnh bìa');
  }
  return res.json();
}

export async function apiAddScanPage(page: { title: string; caption?: string; imageUrl: string }): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch('/api/messbook/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(page)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể thêm trang scan' }));
    throw new Error(err.error || 'Lỗi khi thêm trang scan');
  }
  return res.json();
}

export async function apiDeleteScanPage(pageId: string): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/messbook/page/${pageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể xóa trang scan' }));
    throw new Error(err.error || 'Lỗi khi xóa trang scan');
  }
  return res.json();
}

export async function apiAddComment(pageId: string, author: string, isAnonymous: boolean, content: string): Promise<any> {
  const res = await fetch('/api/messbook/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId, author, isAnonymous, content })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể gửi bình luận' }));
    throw new Error(err.error || 'Lỗi khi gửi bình luận');
  }
  return res.json();
}

export async function apiDeleteComment(pageId: string, commentId: string): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/messbook/comment/${pageId}/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể xóa bình luận' }));
    throw new Error(err.error || 'Lỗi khi xóa bình luận');
  }
  return res.json();
}

export async function apiAddProject(project: any): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể thêm project' }));
    throw new Error(err.error || 'Lỗi khi thêm project');
  }
  return res.json();
}

export async function apiUpdateProject(id: string, project: any): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể cập nhật project' }));
    throw new Error(err.error || 'Lỗi khi cập nhật project');
  }
  return res.json();
}

export async function apiDeleteProject(id: string): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể xóa project' }));
    throw new Error(err.error || 'Lỗi khi xóa project');
  }
  return res.json();
}

export async function apiAddFeedback(feedback: { name: string; isAnonymous: boolean; category: string; content: string; mood?: string }): Promise<any> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Không thể gửi góp ý' }));
    throw new Error(err.error || 'Lỗi khi gửi góp ý');
  }
  return res.json();
}

export async function apiLikeFeedback(id: string): Promise<any> {
  const res = await fetch(`/api/feedback/${id}/like`, {
    method: 'POST'
  });
  return res.json();
}

export async function apiReplyFeedback(id: string, adminReply: string): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/feedback/${id}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ adminReply })
  });
  return res.json();
}

export async function apiDeleteFeedback(id: string): Promise<any> {
  const token = getStoredAdminToken();
  const res = await fetch(`/api/feedback/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}
