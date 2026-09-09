import { useAuthContext } from './auth.context';

export function useAuth() {
  console.log("This is use auth hook");
  
  return useAuthContext();
}