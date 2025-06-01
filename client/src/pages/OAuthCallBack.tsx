import React, {useEffect, useRef, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {signUpWithGoogle, signUpWithMicrosoft} from "../api/services/login-service";
import {OAuthTypeEnum} from "../types/oAuthTypeEnum";
import {GoogleOAuthUserDetails} from "../types/googleOAuthUserDetails";
import {saveToLocalStorage, userDetailsKey} from "../api/services/localStorage.service";
import Text from "../library/typography/Text";
import {BasicUserDetails} from "../types/basic-user-details";
import {MicrosoftOAuthUserDetails} from "../types/microsoftOAuthUserDetails";
export const OAuthCallBack = () => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string>('');
    const { oAuthType, mode } = useParams();
    const calledRef = useRef(false);

    const location = useLocation();
    const nav = useNavigate()

    const getAccessToken = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const codeVerifier = sessionStorage.getItem('pkce_verifier');
        if (!code || !codeVerifier) {
            console.error('Missing code or PKCE verifier');
            nav('/')
            return;
        }
        let userDetails: BasicUserDetails | null = null;
        if (oAuthType === OAuthTypeEnum.GOOGLE) {
            const details: GoogleOAuthUserDetails | undefined = await signUpWithGoogle(oAuthType as OAuthTypeEnum, code as string);
            if (details) {
                userDetails = {
                    firstName: details.family_name,
                    lastName: details.given_name,
                    avatar: details.picture,
                    email: details.email,
                    emailVerified: details.verified_email
                }
            }
        } else if (oAuthType === OAuthTypeEnum.MICROSOFT) {
            const details: MicrosoftOAuthUserDetails | undefined = await signUpWithMicrosoft(oAuthType as OAuthTypeEnum, code as string);
            if (details) {
                userDetails = {
                    firstName: details.givenName,
                    lastName: details.surname || details.displayName,
                    email: details.mail,
                    emailVerified: true
                }
            }
        }
        if (userDetails) {
            saveToLocalStorage(userDetailsKey, userDetails)
            nav('/profile');
        } else {
            setError('Unable to signup')
        }
        setLoading(false);
    }
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        // Only called once
        getAccessToken();
    }, []);
    return (
        <div className="w-full h-screen justify-center items-center">
            {loading && <Text size={'large'} >
                Loading...
            </Text>
            }
            {error && <Text color={'red'}>{error}</Text>}
        </div>
    )
}

