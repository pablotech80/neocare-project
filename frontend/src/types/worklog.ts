export interface Worklog {
  id: number;
  card_id: number;
  user_id: number;
  date: string;
  hours: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWorklogRequest {
  date: string;
  hours: number;
  note?: string;
}

export interface UpdateWorklogRequest {
  hours?: number;
  note?: string;
}

export interface WeeklyWorklogsResponse {
  week: string;
  total_week_hours: number;
  daily_totals: Record<string, number>;
  worklogs: Worklog[];
}
