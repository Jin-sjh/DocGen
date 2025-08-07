"use client"

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { RootState } from '@/store';
import { resetDocumentData, resetCurrentTemplate, updateDocumentData, setActiveTemplate, setHasUnsavedChanges } from '@/store/documentSlice';

export const useDocumentStorage = () => {
  const dispatch = useDispatch();
  const { data, activeTemplate, hasUnsavedChanges } = useSelector((state: RootState) => state.documents);

  const updateData = useCallback((templateId: string, data: any) => {
    dispatch(updateDocumentData({ templateId, data }));
  }, [dispatch]);

  const changeTemplate = useCallback((templateId: string) => {
    dispatch(setActiveTemplate(templateId));
  }, [dispatch]);

  const setUnsavedChanges = useCallback((hasChanges: boolean) => {
    dispatch(setHasUnsavedChanges(hasChanges));
  }, [dispatch]);

  const resetAllData = useCallback(() => {
    // 清除 Redux 状态
    dispatch(resetDocumentData());
    
    // 清除本地存储
    if (typeof window !== 'undefined') {
      try {
        // 清除 redux-persist 的存储
        localStorage.removeItem('persist:prd-generator');
        
        // 清除其他可能相关的存储
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('prd-generator')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  }, [dispatch]);

  const resetCurrentTemplateData = useCallback((templateId: string) => {
    // 只重置当前模板的数据
    dispatch(resetCurrentTemplate(templateId));
  }, [dispatch]);

  return {
    data,
    activeTemplate,
    hasUnsavedChanges,
    updateData,
    changeTemplate,
    setUnsavedChanges,
    resetAllData,
    resetCurrentTemplateData,
  };
}; 