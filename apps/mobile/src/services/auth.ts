import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { authApi } from './api';

WebBrowser.maybeCompleteAuthSession();

const INSTAGRAM_CLIENT_ID = process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID || '';

// Discovery document for Instagram
const discovery = {
  authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
  tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
};

export const useInstagramAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'checkpoint',
    path: 'auth/callback',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: INSTAGRAM_CLIENT_ID,
      scopes: ['user_profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  return {
    request,
    response,
    promptAsync,
    redirectUri,
  };
};

export const exchangeCodeForTokens = async (
  code: string,
  redirectUri: string
) => {
  try {
    const response = await authApi.loginWithInstagram(code, redirectUri);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Token exchange failed:', error);
    return {
      success: false,
      error: 'Failed to authenticate with Instagram',
    };
  }
};

export const getInstagramAuthUrl = (redirectUri: string, state: string) => {
  const params = new URLSearchParams({
    client_id: INSTAGRAM_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'user_profile',
    response_type: 'code',
    state,
  });

  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
};
