import { User } from '../types';

// Domain to role mapping for automatic role detection
const DOMAIN_ROLE_MAPPING: Record<string, string> = {
  'engineering.gov.in': 'engineer',
  'tech.gov.in': 'engineer',
  'admin.gov.in': 'admin',
  'it.gov.in': 'admin',
  'legal.gov.in': 'legal',
  'law.gov.in': 'legal',
  'finance.gov.in': 'finance',
  'accounts.gov.in': 'finance',
  'operations.gov.in': 'controller',
  'station.gov.in': 'controller',
  'control.gov.in': 'controller'
};

// Department mapping for display purposes
const DOMAIN_DEPARTMENT_MAPPING: Record<string, string> = {
  'engineering.gov.in': 'Engineering Department',
  'tech.gov.in': 'Technical Services',
  'admin.gov.in': 'Administration',
  'it.gov.in': 'Information Technology',
  'legal.gov.in': 'Legal Affairs',
  'law.gov.in': 'Legal Department',
  'finance.gov.in': 'Finance Department',
  'accounts.gov.in': 'Accounts Division',
  'operations.gov.in': 'Operations',
  'station.gov.in': 'Station Control',
  'control.gov.in': 'Control Room'
};

export const getRoleFromEmail = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase();
  return DOMAIN_ROLE_MAPPING[domain] || 'engineer'; // Default to engineer
};

export const getDepartmentFromEmail = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase();
  return DOMAIN_DEPARTMENT_MAPPING[domain] || 'General Department';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateGovernmentEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain?.endsWith('.gov.in') || false;
};

export const authenticateUser = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock authentication - in real app, this would be an API call
  if (password.length < 6) {
    throw new Error('Invalid credentials');
  }
  
  if (!validateGovernmentEmail(email)) {
    throw new Error('Please use your official government email address');
  }
  
  if (!name || name.trim().length < 2) {
    throw new Error('Please provide a valid name');
  }
  
  const role = getRoleFromEmail(email) as User['role'];
  const department = getDepartmentFromEmail(email);
  
  // Mock user data based on email domain
  const mockUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    email,
    role,
    department,
    language: 'bilingual',
    designation: getDesignationFromRole(role)
  };
  
  return mockUser;
};

const getNameFromEmail = (email: string): string => {
  const username = email.split('@')[0];
  return username.split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
};

const getDesignationFromRole = (role: string): string => {
  const designations: Record<string, string> = {
    'engineer': 'Senior Engineer',
    'admin': 'System Administrator',
    'legal': 'Legal Officer',
    'finance': 'Finance Officer',
    'controller': 'Station Controller'
  };
  return designations[role] || 'Officer';
};