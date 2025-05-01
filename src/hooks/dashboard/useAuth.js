import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, fetchUser } = useAuthStore();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsAuthLoading(false);
      navigate("/");
    } else if (!user) {
      fetchUser().finally(() => {
        setIsAuthLoading(false);
      });
    } else {
      setIsAuthLoading(false);
    }
  }, [navigate, user, token, fetchUser]);

  // return { user, accessToken: token, isAuthLoading };
  return { user, token, isAuthLoading };
};
