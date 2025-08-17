import {OAuthTypeEnum} from "../../types/oAuthTypeEnum";
import axios from "axios";
import {GoogleOAuthUserDetails} from "../../types/googleOAuthUserDetails";
import {MicrosoftOAuthUserDetails} from "../../types/microsoftOAuthUserDetails";

const googleTokenEndPoint = 'https://oauth2.googleapis.com/token';

const googleUserInfoEndPoint =
    'https://www.googleapis.com/oauth2/v2/userinfo?alt=json';
const microsoftTokenEndPoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const microsoftUserInfoEndPoint = 'https://graph.microsoft.com/v1.0/me';

const getRedirectUrlBasedOnMode = (oAuthType: OAuthTypeEnum): string => {
    return`${process.env.REACT_APP_FE_URL}/callback/${oAuthType}/login`;
}

const getHeaders = (token?: string) => {
    const authorization = {
        Authorization: token ? `Bearer ${token}` : '',
    };

    return {
        ...authorization,
        'Content-Type': 'application/json',
    };
}

export const getGoogleOAuthConsentUrl = (oAuthType: OAuthTypeEnum): string => {
    const clientId = process.env.REACT_APP_GOOGLE_SSO_CLIENT_ID as string;
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(getRedirectUrlBasedOnMode(oAuthType))}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent("email profile")}` +
        `&access_type=offline` +
        `&prompt=consent`;
};

export const getMicrosoftOAuthConsent = async (oAuthType: OAuthTypeEnum): Promise<string> => {
    const clientId = process.env.REACT_APP_MICROSOFT_SSO_CLIENT_ID as string;
    const redirectUri = getRedirectUrlBasedOnMode(oAuthType);

    const { codeVerifier, codeChallenge } = await generatePKCE();

    sessionStorage.setItem('pkce_verifier', codeVerifier);

    const scope = 'openid profile email User.Read';

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
        `?client_id=${clientId}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${codeChallenge}`;
};


export const signUpWithGoogle = async (oAuthType: OAuthTypeEnum, authCode: string) => {
    try {
        const clientId = process.env.REACT_APP_GOOGLE_SSO_CLIENT_ID as string;
        const clientSecret = process.env.REACT_APP_GOOGLE_SSO_CLIENT_SECRET as string;
        const body = {
            client_id: clientId,
            code: authCode,
            client_secret: clientSecret,
            redirect_uri: getRedirectUrlBasedOnMode(oAuthType),
            grant_type: 'authorization_code',
        };

        const response = await axios.request({
            url: googleTokenEndPoint,
            method: 'POST',
            data: body,
            headers: getHeaders()
        })
        if (response.status === 200) {
            const accessToken = response.data.access_token;
            return await getGoogleUserDetails(accessToken);
        }
    } catch(error){
        console.error(error);
        throw error
    }
}

export const getGoogleUserDetails = async (token: string): Promise<GoogleOAuthUserDetails> => {
    try {
        const response = await axios.request({
            url: googleUserInfoEndPoint,
            method: 'GET',
            headers: getHeaders(token),
        });

        return response.data as GoogleOAuthUserDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function base64URLEncode(buffer: ArrayBuffer): string {
    // @ts-ignore
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function generatePKCE(): Promise<{
    codeVerifier: string;
    codeChallenge: string;
}> {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);

    const codeVerifier = base64URLEncode(array.buffer);
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = base64URLEncode(digest);

    return { codeVerifier, codeChallenge };
}


export const signUpWithMicrosoft = async (oAuthType: OAuthTypeEnum, authCode: string) => {
    try {
        const clientId = process.env.REACT_APP_MICROSOFT_SSO_CLIENT_ID as string;
        const codeVerifier = sessionStorage.getItem('pkce_verifier') as string;
        const redirectUri = getRedirectUrlBasedOnMode(oAuthType);

        const body = new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        });

        const response = await axios.request({
            url: microsoftTokenEndPoint,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: body,
        })

        const data = await response.data
        if (data.access_token) {
            if (response.status === 200) {
                const accessToken = data.access_token;
                return await getMicrosoftUserDetails(accessToken);
            }
        } else {
            console.error('❌ Token exchange failed:', data);
        }

    } catch(error){
        console.error(error);
        throw error
    }
}

const getMicrosoftUserDetails = async (token: string): Promise<MicrosoftOAuthUserDetails> => {
    try {
        const response = await axios.request({
            url: microsoftUserInfoEndPoint,
            method: 'GET',
            headers: getHeaders(token),
        });

        return response.data as MicrosoftOAuthUserDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
