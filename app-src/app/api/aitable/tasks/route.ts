import { NextRequest, NextResponse } from 'next/server';
import { AITableClient } from '@/lib/api/aitable-client';
import { 
  TASK_FIELDS, 
  formatLinkedRecord 
} from '@/lib/utils/aitable-utils';

// Create a singleton instance of AITableClient
const client = new AITableClient(process.env.AITABLE_API_TOKEN || '');

// Use hardcoded datasheet ID
const TASKS_DATASHEET_ID = 'dstABC123';
const SPACE_ID = 'spc12q5HY4ay5';

// GET all tasks or tasks for a specific project
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('taskId');
  const projectId = searchParams.get('projectId');
  
  try {
    if (taskId) {
      // Get a single task by ID
      const response = await client.getRecords(TASKS_DATASHEET_ID, {
        fieldKey: 'name',
      });
      
      const task = response.records.find(record => record.recordId === taskId);
      
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: task });
    } else {
      // Get all tasks, optionally filtered by project
      const response = await client.getRecords(TASKS_DATASHEET_ID, {
        fieldKey: 'name',
      });
      
      let tasks = response.records;
      
      // Filter by project if projectId is provided
      if (projectId) {
        tasks = tasks.filter(task => {
          const project = task.fields[TASK_FIELDS.PROJECT];
          return project && Array.isArray(project) && 
            project.some((p: any) => p.recordId === projectId);
        });
      }
      
      return NextResponse.json({ success: true, data: tasks });
    }
  } catch (error: any) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// CREATE a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body[TASK_FIELDS.TITLE]) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }
    
    // Format linked records
    if (body[TASK_FIELDS.PROJECT] && !Array.isArray(body[TASK_FIELDS.PROJECT])) {
      body[TASK_FIELDS.PROJECT] = formatLinkedRecord(body[TASK_FIELDS.PROJECT]);
    }
    
    if (body[TASK_FIELDS.ASSIGNEE] && !Array.isArray(body[TASK_FIELDS.ASSIGNEE])) {
      body[TASK_FIELDS.ASSIGNEE] = formatLinkedRecord(body[TASK_FIELDS.ASSIGNEE]);
    }
    
    const response = await client.createRecords(
      TASKS_DATASHEET_ID,
      [{ fields: body }],
      'name'
    );
    
    return NextResponse.json({ 
      success: true, 
      data: response[0],
      message: 'Task created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating task:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// UPDATE an existing task
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.recordId) {
      return NextResponse.json({ error: 'Task ID (recordId) is required' }, { status: 400 });
    }
    
    // Format linked records
    if (
      body.fields[TASK_FIELDS.PROJECT] && 
      !Array.isArray(body.fields[TASK_FIELDS.PROJECT])
    ) {
      body.fields[TASK_FIELDS.PROJECT] = formatLinkedRecord(body.fields[TASK_FIELDS.PROJECT]);
    }
    
    if (
      body.fields[TASK_FIELDS.ASSIGNEE] && 
      !Array.isArray(body.fields[TASK_FIELDS.ASSIGNEE])
    ) {
      body.fields[TASK_FIELDS.ASSIGNEE] = formatLinkedRecord(body.fields[TASK_FIELDS.ASSIGNEE]);
    }
    
    const response = await client.updateRecords(
      TASKS_DATASHEET_ID,
      [{ recordId: body.recordId, fields: body.fields }],
      'name'
    );
    
    return NextResponse.json({ 
      success: true, 
      data: response[0],
      message: 'Task updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating task:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// DELETE a task
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: 'Task ID (taskId) is required' }, { status: 400 });
  }
  
  try {
    await client.deleteRecords(TASKS_DATASHEET_ID, [taskId]);
    
    return NextResponse.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting task:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
} 