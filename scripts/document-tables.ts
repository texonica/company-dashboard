import { AITableService } from '../app-src/lib/services/aitable-service';
import { promises as fs } from 'fs';
import path from 'path';

interface Field {
  name: string;
  type: string;
  description?: string;
  property?: {
    foreignDatasheetId?: string;
  };
}

interface DatasheetNode {
  id: string;
  name: string;
  type: string;
  description?: string;
  spaceId?: string;
}

async function generateTableDocumentation() {
  const service = AITableService.getInstance();
  
  console.log('Fetching all datasheets...');
  const datasheets = await service.getAllDatasheets();
  
  let documentation = '# AITable Database Documentation\n\n';
  documentation += `Last updated: ${new Date().toISOString()}\n\n`;
  documentation += `Space ID: spc12q5HY4ay5\n\n`;
  
  documentation += '## Tables Overview\n\n';
  
  for (const datasheet of datasheets as DatasheetNode[]) {
    documentation += `### ${datasheet.name}\n`;
    documentation += `- **ID**: \`${datasheet.id}\`\n`;
    documentation += `- **Type**: ${datasheet.type}\n`;
    if (datasheet.description) {
      documentation += `- **Description**: ${datasheet.description}\n`;
    }
    documentation += `- **URL**: https://aitable.ai/space/spc12q5HY4ay5/workbench/${datasheet.id}\n`;
    documentation += '\n';
    
    // Get fields for this datasheet
    try {
      // Since we can't access client directly, we'll need to implement this in the service
      const fields = await service.getDatasheetFields(datasheet.id);
      documentation += '#### Fields\n\n';
      documentation += '| Field Name | Type | Description |\n';
      documentation += '|------------|------|-------------|\n';
      
      for (const field of fields as Field[]) {
        documentation += `| ${field.name} | ${field.type} | ${field.description || '-'} |\n`;
      }
      documentation += '\n';
      
      // Get linked fields
      const linkedFields = fields.filter(f => f.type === 'MagicLink');
      if (linkedFields.length > 0) {
        documentation += '#### Relationships\n\n';
        for (const field of linkedFields) {
          if (field.property?.foreignDatasheetId) {
            documentation += `- **${field.name}** links to \`${field.property.foreignDatasheetId}\`\n`;
          }
        }
        documentation += '\n';
      }
    } catch (error) {
      console.error(`Error fetching fields for datasheet ${datasheet.id}:`, error);
      documentation += '⚠️ Error fetching fields for this datasheet\n\n';
    }
  }
  
  // Save documentation
  const docsPath = path.join(process.cwd(), 'docs');
  await fs.mkdir(docsPath, { recursive: true });
  await fs.writeFile(
    path.join(docsPath, 'aitable-database.md'),
    documentation,
    'utf-8'
  );
  
  console.log('Documentation generated successfully!');
}

generateTableDocumentation().catch(console.error); 