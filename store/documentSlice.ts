import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DocumentData {
  [templateId: string]: any;
}

interface DocumentState {
  data: DocumentData;
  activeTemplate: string;
  hasUnsavedChanges: boolean;
}

const initialState: DocumentState = {
  data: {},
  activeTemplate: 'prd',
  hasUnsavedChanges: false,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setActiveTemplate: (state, action: PayloadAction<string>) => {
      state.activeTemplate = action.payload;
      state.hasUnsavedChanges = false;
    },
    updateDocumentData: (state, action: PayloadAction<{ templateId: string; data: any }>) => {
      const { templateId, data } = action.payload;
      state.data[templateId] = data;
      state.hasUnsavedChanges = true;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
    resetDocumentData: (state) => {
      // 重置到初始状态
      state.data = {};
      state.activeTemplate = 'prd';
      state.hasUnsavedChanges = false;
      
      // 清除本地存储
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('persist:prd-generator');
        } catch (error) {
          console.warn('Failed to clear localStorage:', error);
        }
      }
    },
    resetCurrentTemplate: (state, action: PayloadAction<string>) => {
      // 只重置当前模板的数据
      const templateId = action.payload;
      console.log('Redux - resetCurrentTemplate called with templateId:', templateId);
      console.log('Redux - before reset, state.data:', state.data);
      if (state.data[templateId]) {
        delete state.data[templateId];
        state.hasUnsavedChanges = false;
        console.log('Redux - after reset, state.data:', state.data);
        
        // 清除localStorage中的持久化数据
        if (typeof window !== 'undefined') {
          try {
            // 获取当前的持久化数据
            const persistKey = 'persist:prd-generator';
            const persistData = localStorage.getItem(persistKey);
            if (persistData) {
              const parsedData = JSON.parse(persistData);
              if (parsedData.documents) {
                const documentsData = JSON.parse(parsedData.documents);
                if (documentsData.data && documentsData.data[templateId]) {
                  delete documentsData.data[templateId];
                  documentsData.hasUnsavedChanges = false;
                  parsedData.documents = JSON.stringify(documentsData);
                  localStorage.setItem(persistKey, JSON.stringify(parsedData));
                  console.log('Redux - localStorage updated after reset');
                }
              }
            }
          } catch (error) {
            console.warn('Failed to clear localStorage:', error);
          }
        }
      } else {
        // 即使没有数据，也要确保状态正确
        state.hasUnsavedChanges = false;
        console.log('Redux - no data to delete for templateId:', templateId);
      }
    },
  },
});

export const {
  setActiveTemplate,
  updateDocumentData,
  setHasUnsavedChanges,
  resetDocumentData,
  resetCurrentTemplate,
} = documentSlice.actions;

export default documentSlice.reducer; 