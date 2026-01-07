// services/historySync.js
// 管理未登录时待同步的历史记录（保存在 localStorage），登录后自动回放保存到后端

import historyService from './historyService';

const STORAGE_KEY = 'pending_history_uploads_v1';

function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function enqueuePendingHistory(item) {
  const list = readQueue();
  // 限制最大长度，避免无限增长
  if (list.length > 200) list.shift();
  list.push({ ...item, _queuedAt: Date.now() });
  writeQueue(list);
}

export async function flushPendingHistory() {
  const list = readQueue();
  if (!list.length) return { total: 0, success: 0 };

  let success = 0;
  const remain = [];
  for (const item of list) {
    try {
      await historyService.saveGeneratedContent(item);
      success += 1;
    } catch (e) {
      // 保留失败项，稍后再试
      remain.push(item);
    }
  }
  writeQueue(remain);
  return { total: list.length, success };
}
