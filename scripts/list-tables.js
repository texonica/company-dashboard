const { AITableService } = require('../app-src/lib/services/aitable-service');

async function listTables() {
  try {
    const service = AITableService.getInstance();
    
    console.log('Fetching all nodes...');
    const nodes = await service.getAllNodes();
    
    // Get all datasheets
    const datasheets = nodes.filter(node => node.type === 'Datasheet');
    console.log('\nDatasheets found:', datasheets.length);
    
    for (const ds of datasheets) {
      console.log(`\n=== ${ds.name} ===`);
      console.log(`ID: ${ds.id}`);
      console.log(`Parent: ${ds.parentId || 'root'}`);
      
      try {
        const fields = await service.getDatasheetFields(ds.id);
        console.log('\nFields:');
        fields.forEach(field => {
          console.log(`- ${field.name} (${field.type})`);
          if (field.type === 'MagicLink' && field.property?.foreignDatasheetId) {
            console.log(`  Links to: ${field.property.foreignDatasheetId}`);
          }
        });
      } catch (error) {
        console.error(`Error fetching fields for ${ds.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listTables(); 