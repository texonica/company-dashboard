/**
 * Types for ClickUp API responses and data structures
 */

export interface ClickUpUser {
  id: number;
  username: string;
  email: string;
  color: string;
  profilePicture: string;
  initials: string;
  role: number;
  custom_role?: number;
  last_active?: string;
  date_joined?: string;
  date_invited?: string;
}

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  members: ClickUpUser[];
}

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: Array<{
    id: string;
    status: string;
    type: string;
    orderindex: number;
    color: string;
  }>;
  multiple_assignees: boolean;
  features: Record<string, boolean>;
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  status: {
    status: string;
    color: string;
    hide_label: boolean;
  };
  priority: {
    priority: string;
    color: string;
  };
  assignee: ClickUpUser | null;
  task_count: number;
  due_date: string | null;
  start_date: string | null;
  space: { id: string; name: string; access: boolean };
  archived: boolean;
  override_statuses: boolean;
  permission_level: string;
}

export interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  status: {
    status: string;
    color: string;
    orderindex: number;
    type: string;
  };
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  creator: {
    id: number;
    username: string;
    color: string;
    profilePicture: string;
  };
  assignees: ClickUpUser[];
  checklists: any[];
  tags: Array<{ name: string; tag_fg: string; tag_bg: string; }>;
  parent: string | null;
  priority: {
    id: string;
    priority: string;
    color: string;
    orderindex: string;
  } | null;
  due_date: string | null;
  start_date: string | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: any[];
} 