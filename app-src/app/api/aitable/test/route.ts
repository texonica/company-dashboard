import { NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';

const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

/**
 * Recursively get all nodes including those inside folders
 */
async function getAllNodesRecursive(spaceId: string, folderId?: string): Promise<any[]> {
  const nodes = folderId 
    ? await client.getFolderChildren(spaceId, folderId)
    : await client.getNodes(spaceId);

  const result = [...nodes];

  // For each folder, recursively get its children
  for (const node of nodes) {
    if (node.type === 'Folder') {
      const children = await getAllNodesRecursive(spaceId, node.id);
      // Add a children property to the folder node
      const folderIndex = result.findIndex(n => n.id === node.id);
      if (folderIndex !== -1) {
        result[folderIndex] = {
          ...result[folderIndex],
          children
        };
      }
    }
  }

  return result;
}

export async function GET() {
  try {
    // Get all nodes recursively from the default space
    const response = await getAllNodesRecursive('spc12q5HY4ay5');
    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error('Test endpoint error:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.response?.data
      }, 
      { status: error.response?.status || 500 }
    );
  }
} 