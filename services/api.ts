import { RegistrationData, LoginData, ApiResponse } from '../types';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://netvoya-backend.vercel.app/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Helper function to handle API responses
 */
async function handleResponse(response: Response): Promise<ApiResponse> {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 400) {
      throw new ApiError(data.message || "Invalid request. Please check your inputs.", 400);
    } else if (response.status === 409) {
      throw new ApiError(data.message || "Account already registered with this email or username.", 409);
    } else if (response.status === 401) {
      throw new ApiError(data.message || "Invalid credentials.", 401);
    } else if (response.status === 500) {
      throw new ApiError("Server error. Please try again later.", 500);
    } else {
      throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status);
    }
  }

  return data as ApiResponse;
}

/**
 * Registers a new user with the backend API
 */
export const registerUser = async (data: RegistrationData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        username: data.username.trim(),
        email: data.email.trim(),
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network errors
    throw new ApiError("Connection failed. Please check your internet connection.", 0);
  }
};

/**
 * Authenticates a user
 */
export const loginUser = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email.trim(),
        password: data.password,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Connection failed. Please check your internet connection.", 0);
  }
};

/**
 * Updates a user's password
 */
export const changePassword = async (data: { userId: string, currentPassword: string, newPassword: string }): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Connection failed. Please check your internet connection.", 0);
  }
};

/**
 * TEST UTILS:
 * To test without a backend, uncomment the code blocks below inside the functions
 * and comment out the fetch calls.
 */
/*
// Mock Register
if (data.email.includes('error')) throw new ApiError("Simulated API Error", 500);
await new Promise(r => setTimeout(r, 1500)); // Delay
return { success: true, message: "User registered", user: { id: "1", username: data.username, email: data.email, role: data.role } };

// Mock Login
if (data.email === 'error') throw new ApiError("Invalid credentials", 401);
await new Promise(r => setTimeout(r, 1500));
return { success: true, message: "Login successful", token: "mock-jwt", user: { id: "1", username: "test", email: data.email, role: "partner" } };
*/
