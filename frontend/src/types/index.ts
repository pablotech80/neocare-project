export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Board {
  id: number;
  title: string;
  user_id: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  msg: string;
  id: number;
  default_board_id: number;
}

// Re-export worklog types
export type {
  Worklog,
  CreateWorklogRequest,
  UpdateWorklogRequest,
  WeeklyWorklogsResponse,
} from './worklog';
