import React from 'react';
import Text from "./typography/Text";
import {OAuthTypeEnum} from "../types/oAuthTypeEnum";
import {MicrosoftIcon} from "./icons/MicrosoftIcon";
interface MicrosoftOAuthButtonProps {
    onClick: (oAuthType: OAuthTypeEnum) => Promise<void>;
    text: string
}

const MicrosoftOAuthButton = (props: MicrosoftOAuthButtonProps) => {
    const { onClick, text } = props;

    const handleOnClick = async () => {
        await onClick(OAuthTypeEnum.MICROSOFT)
    }
    return (
        <div className="w-80" onClick={handleOnClick}>
            <div className="w-full bg-white rounded-md cursor-pointer shadow px-3 py-2">
                <div className="flex gap-2 justify-center items-center" v-loading="loading">
                    <MicrosoftIcon />
                    <Text size={'normal'}>{text}</Text>
                </div>
            </div>
        </div>
    )
}

export default MicrosoftOAuthButton;
