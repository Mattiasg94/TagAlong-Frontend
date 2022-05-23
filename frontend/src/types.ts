export interface AccountResponse {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created: Date;
  updated: Date;
  access: string;
  refresh: string;
}

export interface User {
  email: string
  first_name: string
  friends: User[]
  full_name: string
  id: number
  last_name: string
  username: string
  profile_img?: any
}

export interface Event {
  user: User,
  adress?: string
  adress_link?: string
  date?: any
  description?: string
  id: number
  invites: User[]
  participants: User[]
  title: string
}

export interface Template {
  user: User,
  adress?: string
  adress_link?: string
  date?: any
  description?: string
  id?: number
  invites: User[]
  title?: string
}

export interface FriendRequest {
  id: number,
  from_user: number,
  to_user: number,
}