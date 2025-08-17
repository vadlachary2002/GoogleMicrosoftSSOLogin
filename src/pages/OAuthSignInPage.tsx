import React, {useEffect} from 'react';
import GoogleOAuthButton from '../library/GoogleOAuthButton';
import {OAuthTypeEnum} from "../types/oAuthTypeEnum";
import {getGoogleOAuthConsentUrl, getMicrosoftOAuthConsent} from "../api/services/login-service";
import MicrosoftOAuthButton from "../library/MicrosoftOAuthButton";
import {getFromLocalStorage, userDetailsKey} from "../api/services/localStorage.service";
import {useNavigate} from "react-router-dom";

export const OAuthSignInPage = () => {
    const nav = useNavigate();
    const signInWithGoogle = async (oAuthType: OAuthTypeEnum) => {
        const url = getGoogleOAuthConsentUrl(oAuthType)
        if (url && url.length > 0) {
            window.location.href = url;
        }
    }

    const signInWithMicrosoft = async (oAuthType: OAuthTypeEnum) => {
        const url = await getMicrosoftOAuthConsent(oAuthType)
        if (url && url.length > 0) {
            window.location.href = url;
        }
    }

    useEffect(() => {
        if (getFromLocalStorage(userDetailsKey)) {
            nav('/profile')
        }
    }, [])
    return (
        <div  className=" bg-gray-200 w-full h-screen flex justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-2">
                <GoogleOAuthButton text={'Sign in with Google'} onClick={signInWithGoogle} />
                <MicrosoftOAuthButton text={'Sign in with Microsoft'} onClick={signInWithMicrosoft} />
            </div>
        </div>
    );
}
