import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

/**
 * Landing spot for any URL with no allowed screen. The guarded groups switch
 * on the session, so "/" doesn't exist while signed out (and /sign-in doesn't
 * exist while signed in). Send the user to whichever side they belong on.
 */
export default function NotFound() {
  const { token } = useAuth();
  return <Redirect href={token ? '/' : '/sign-in'} />;
}
