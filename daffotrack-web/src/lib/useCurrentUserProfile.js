import { useEffect, useState } from 'react';
import { apiRequest } from './api';
import { getCurrentUser, setCurrentUser, subscribeCurrentUser } from './session';

export default function useCurrentUserProfile() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    return subscribeCurrentUser((updatedUser) => {
      setUser(updatedUser);
    });
  }, []);

  useEffect(() => {
    if (!user?.userId) return undefined;

    let ignore = false;
    const storedUser = user;

    apiRequest(`/api/users/${storedUser.userId}`)
      .then((profile) => {
        if (ignore) return;
        const mergedUser = { ...getCurrentUser(), ...storedUser, ...profile };
        setCurrentUser(mergedUser);
        setUser(mergedUser);
      })
      .catch(() => {
        if (!ignore) {
          setUser(storedUser);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.userId]);

  return user;
}
