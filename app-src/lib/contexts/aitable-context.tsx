'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AITableService } from '../services/aitable-service';

// Define the context type
interface AITableContextType {
  service: AITableService;
  isLoading: boolean;
  error: Error | null;
  spaces: any[];
  nodes: any[];
  datasheets: any[];
  selectedSpaceId: string | null;
  selectedDatasheetId: string | null;
  setSelectedSpaceId: (spaceId: string) => void;
  setSelectedDatasheetId: (datasheetId: string) => void;
  refreshSpaces: () => Promise<void>;
  refreshNodes: () => Promise<void>;
  refreshDatasheets: () => Promise<void>;
}

// Create the context with a default value
const AITableContext = createContext<AITableContextType | undefined>(undefined);

// Provider component
interface AITableProviderProps {
  children: ReactNode;
}

export const AITableProvider: React.FC<AITableProviderProps> = ({ children }) => {
  const service = AITableService.getInstance();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [datasheets, setDatasheets] = useState<any[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedDatasheetId, setSelectedDatasheetId] = useState<string | null>(null);
  
  // Fetch spaces on mount
  useEffect(() => {
    refreshSpaces();
  }, []);
  
  // Fetch nodes when a space is selected
  useEffect(() => {
    if (selectedSpaceId) {
      refreshNodes();
      refreshDatasheets();
    }
  }, [selectedSpaceId]);
  
  // Refresh spaces
  const refreshSpaces = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const spaces = await service.getAllSpaces();
      setSpaces(spaces);
      
      // Set the first space as selected if none is selected
      if (spaces.length > 0 && !selectedSpaceId) {
        setSelectedSpaceId(spaces[0].id);
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh nodes
  const refreshNodes = async () => {
    if (!selectedSpaceId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const nodes = await service.getAllNodes(selectedSpaceId);
      setNodes(nodes);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh datasheets
  const refreshDatasheets = async () => {
    if (!selectedSpaceId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const datasheets = await service.getAllDatasheets(selectedSpaceId);
      setDatasheets(datasheets);
      
      // Set the first datasheet as selected if none is selected
      if (datasheets.length > 0 && !selectedDatasheetId) {
        setSelectedDatasheetId(datasheets[0].id);
      }
    } catch (error) {
      console.error('Error fetching datasheets:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value: AITableContextType = {
    service,
    isLoading,
    error,
    spaces,
    nodes,
    datasheets,
    selectedSpaceId,
    selectedDatasheetId,
    setSelectedSpaceId,
    setSelectedDatasheetId,
    refreshSpaces,
    refreshNodes,
    refreshDatasheets,
  };
  
  return (
    <AITableContext.Provider value={value}>
      {children}
    </AITableContext.Provider>
  );
};

// Custom hook to use the AITable context
export const useAITable = () => {
  const context = useContext(AITableContext);
  
  if (context === undefined) {
    throw new Error('useAITable must be used within an AITableProvider');
  }
  
  return context;
}; 