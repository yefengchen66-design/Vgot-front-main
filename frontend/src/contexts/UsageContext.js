import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

/*
UsageContext
Provides: dailyUsage, loading, initialized, refresh, updateActionUsage
Caching: localStorage key 'dailyUsageCache' with { data, timestamp }
Auto-refresh: on login (user change) + every 5 minutes (if Free tier)
*/

// 从环境变量获取API基础URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const UsageContext = createContext(null);

export function UsageProvider({ children }) {
  const { user } = useAuth();
  const [dailyUsage, setDailyUsage] = useState({
    script_extraction: { current: 0, limit: 50, remaining: 50 },
    script_analysis: { current: 0, limit: 50, remaining: 50 },
    script_rewrite: { current: 0, limit: 50, remaining: 50 }
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const refreshTimerRef = useRef(null);

  // Load from cache instantly
  useEffect(() => {
    const cached = localStorage.getItem('dailyUsageCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cacheDate = new Date(parsed.timestamp).toDateString();
        const today = new Date().toDateString();
        if (cacheDate === today && parsed.data) {
          setDailyUsage(parsed.data);
          setInitialized(true);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const fetchUsage = async (force = false) => {
    if (!user) return;
    if (loading && !force) return; // avoid duplicate unless forced
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const resp = await axios.get(`${API_BASE_URL}/api/credits/daily-usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.data?.success && resp.data?.data) {
        setDailyUsage(resp.data.data);
        setInitialized(true);
        localStorage.setItem('dailyUsageCache', JSON.stringify({
          data: resp.data.data,
          timestamp: new Date().toISOString()
        }));
      } else {
        // If backend didn't return expected shape, still mark initialized so UI stops showing loading
        setInitialized(true);
      }
    } catch (e) {
      // swallow errors, keep existing cached usage
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // On user change (login/logout)
  useEffect(() => {
    if (user) {
      fetchUsage(true);
      // Set up periodic refresh (5 min)
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = setInterval(() => fetchUsage(), 5 * 60 * 1000);
    } else {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      setInitialized(false);
    }
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [user?.id, user?.tier]);

  // Optimistic update after an action
  const updateActionUsage = (actionType) => {
    setDailyUsage(prev => {
      const current = prev[actionType];
      if (!current) return prev;
      const updated = {
        ...prev,
        [actionType]: {
          ...current,
            current: current.current + 1,
            remaining: Math.max(0, current.remaining - 1)
        }
      };
      localStorage.setItem('dailyUsageCache', JSON.stringify({
        data: updated,
        timestamp: new Date().toISOString()
      }));
      return updated;
    });
    // Trigger a background refresh (debounced) to reconcile server state
    setTimeout(() => fetchUsage(true), 800);
  };

  const value = {
    dailyUsage,
    loading,
    initialized,
    refresh: () => fetchUsage(true),
    updateActionUsage
  };

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export function useUsage() {
  return useContext(UsageContext);
}
