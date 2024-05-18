import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Nullable } from "../../@types/NullableType";
import {
  LocalStorageToken,
  signInRequest,
  signUpRequest,
  updateStoredTokensFromRefresh,
} from "../../lib/services/auth";

interface AuthState {
  accessToken: Nullable<string>;
  username: Nullable<string>;
}

interface AuthContextProps extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  username: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
  isAuthenticated: () => false,
});

interface ProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    username: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageToken.accessToken) as string;

    let user = null;
    try {
      user = jwtDecode(token) as {
        username: string;
        accessToken: string;
        refreshToken: string;
      };
    } catch (_) {}

    if (token && user) {
      setAuthState({ accessToken: token, username: user.username });
    }
  }, []);

  const refreshAccessToken = async () => {
    try {
      await updateStoredTokensFromRefresh();

      const accessToken = localStorage.getItem(
        LocalStorageToken.accessToken
      ) as string;

      setAuthState((state) => ({ ...state, accessToken }));
    } catch (error) {
      setAuthState({ username: null, accessToken: null });
      throw new Error(`Failed to refresh token ${error}`);
    }
  };

  const login = async (username: string, password: string) => {
    const signInInfo = await signInRequest(username, password);

    if (!signInInfo.success) {
      throw new Error(signInInfo.message);
    }

    const { accessToken } = signInInfo;

    setAuthState({ accessToken, username });
  };

  const signup = async (username: string, password: string) => {
    const signupInfo = await signUpRequest(username, password);

    if (!signupInfo.success) {
      throw new Error(signupInfo.message);
    }

    const loginInfo = await signInRequest(username, password);

    if (!loginInfo.success) {
      throw new Error(loginInfo.message);
    }

    const { accessToken } = loginInfo;

    setAuthState({ accessToken, username });
  };

  const isAuthenticated = (): boolean => {
    if (
      !localStorage.getItem(LocalStorageToken.accessToken) ||
      !localStorage.getItem(LocalStorageToken.refreshToken)
    ) {
      return false;
    }

    try {
      const decodedToken = jwtDecode(
        localStorage.getItem(LocalStorageToken.accessToken) as string
      ) as {
        username: string;
        accessToken: string;
        refreshToken: string;
      };

      return !!decodedToken.username;
    } catch (_) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(LocalStorageToken.accessToken);
    localStorage.removeItem(LocalStorageToken.refreshToken);
    setAuthState({ accessToken: null, username: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        refreshAccessToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { AuthContextProvider, useAuth };
