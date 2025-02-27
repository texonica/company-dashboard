const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const SPACE_ID = 'spc12q5HY4ay5';
const API_TOKEN = process.env.NEXT_PUBLIC_AITABLE_API_TOKEN;

if (!API_TOKEN) {
  console.error('Error: NEXT_PUBLIC_AITABLE_API_TOKEN environment variable is not set');
  process.exit(1);
}

const client = axios.create({
  baseURL: 'https://aitable.ai/fusion/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

async function generateTableDocumentation() {
  try {
    console.log('Fetching nodes...');
    const { data: nodesResponse } = await client.get(`/spaces/${SPACE_ID}/nodes`);
    const datasheets = nodesResponse.data.nodes.filter(node => node.type === 'Datasheet');

    let documentation = '# AITable Database Documentation\n\n';
    documentation += `Last updated: ${new Date().toISOString()}\n\n`;
    documentation += `Space ID: ${SPACE_ID}\n\n`;
    documentation += '## Tables Overview\n\n';

    for (const datasheet of datasheets) {
      console.log(`Processing datasheet: ${datasheet.name}`);
      
      documentation += `### ${datasheet.name}\n`;
      documentation += `- **ID**: \`${datasheet.id}\`\n`;
      documentation += `- **Type**: ${datasheet.type}\n`;
      if (datasheet.description) {
        documentation += `- **Description**: ${datasheet.description}\n`;
      }
      documentation += `- **URL**: https://aitable.ai/space/${SPACE_ID}/workbench/${datasheet.id}\n\n`;

      try {
        const { data: fieldsResponse } = await client.get(`/datasheets/${datasheet.id}/fields`);
        const fields = fieldsResponse.data.fields;

        documentation += '#### Fields\n\n';
        documentation += '| Field Name | Type | Description |\n';
        documentation += '|------------|------|-------------|\n';

        for (const field of fields) {
          documentation += `| ${field.name} | ${field.type} | ${field.description || '-'} |\n`;
        }
        documentation += '\n';

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
        console.error(`Error fetching fields for datasheet ${datasheet.id}:`, error.message);
        documentation += '⚠️ Error fetching fields for this datasheet\n\n';
      }
    }

    const docsPath = path.join(process.cwd(), 'docs');
    await fs.mkdir(docsPath, { recursive: true });
    await fs.writeFile(
      path.join(docsPath, 'aitable-database.md'),
      documentation,
      'utf-8'
    );

    console.log('Documentation generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

generateTableDocumentation(); 