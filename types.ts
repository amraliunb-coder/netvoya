import { ReactNode } from "react";

export interface ChildrenProps {
  children: ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface SectionProps extends ChildrenProps, ClassNameProps {
  id?: string;
}

export interface CardProps extends ChildrenProps, ClassNameProps {
  noHoverEffect?: boolean;
}

// API Interfaces
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  vatId?: string;
  role: 'partner' | 'admin';
}

export interface LoginData {
  email: string; // Can be username or email
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName?: string;
    companyName?: string;
    requiresPasswordChange?: boolean;
  };
  token?: string;
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  terms?: string;
  general?: string;
}
