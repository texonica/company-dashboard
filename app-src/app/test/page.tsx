'use client';

import { useEffect, useState } from 'react';
import { AITableNode } from '@/lib/api/aitable-client';

function NodeTree({ node, depth = 0 }: { node: AITableNode; depth?: number }) {
  const style = {
    marginLeft: `${depth * 20}px`,
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle = {
    marginRight: '8px',
    opacity: 0.7,
  };

  const typeStyle = {
    marginLeft: '8px',
    fontSize: '0.8em',
    opacity: 0.5,
  };

  return (
    <div>
      <div style={style}>
        <span style={iconStyle}>{node.icon || (node.type === 'Folder' ? '📁' : '📄')}</span>
        <span>{node.name}</span>
        <span style={typeStyle}>{node.type}</span>
      </div>
      {node.children?.map(child => (
        <NodeTree key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function TestPage() {
  const [nodes, setNodes] = useState<AITableNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/aitable/test')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNodes(data.data);
        } else {
          setError(data.error || 'Unknown error');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>AITable Node Hierarchy</h1>
      <div>
        {nodes.map(node => (
          <NodeTree key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
} 