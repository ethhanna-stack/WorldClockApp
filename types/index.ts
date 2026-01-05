export interface User {
  id: string;
  email: string;
  displayName?: string;
  timezone: string;
  shareCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  contactEmail: string;
  contactDisplayName?: string;
  contactTimezone: string;
  addedAt: Date;
}

export interface TimeZoneInfo {
  timezone: string;
  offset: number;
  currentTime: Date;
  displayName: string;
}

