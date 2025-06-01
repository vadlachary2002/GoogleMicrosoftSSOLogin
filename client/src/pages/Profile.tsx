import React, {useEffect} from 'react'
import {useState} from "react";
import {getFromLocalStorage, removeFromLocalStorage, userDetailsKey} from "../api/services/localStorage.service";
import {useNavigate} from "react-router-dom";
import Text from "../library/typography/Text";
import {BasicUserDetails} from "../types/basic-user-details";

export const Profile = () => {
    const [userDetails, setUserDetails] = useState<BasicUserDetails>()
    const nav = useNavigate()

    const logOut = () => {
        removeFromLocalStorage(userDetailsKey)
        nav('/')
    }
    useEffect(() => {
        const details = getFromLocalStorage(userDetailsKey)
        if (details) {
            setUserDetails(details)
        } else{
            nav('/')
        }
    })
    if (userDetails) {
        return (
            <div className="w-full bg-gray-50 h-screen flex justify-center items-center">
                <div className="bg-white w-80 p-4 border box-border shadow-sm rounded-md flex flex-col gap-2">
                    <div>
                        {userDetails.avatar && <img src={userDetails.avatar} className="w-40 h-40 rounded-full mx-auto"  alt="Image"/>}
                    </div>
                    <div className="w-full flex justify-center">
                        <Text size="large" weight="bolder" >{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
                    </div>
                    <div className="flex flex-col justify-start gap-2 px-2">
                        <Text size="normal" className="px-2">{userDetails.email}</Text>
                        <div className={`${userDetails.emailVerified ? 'bg-green-300 border-green-600' : 'bg-red-300 border-red-600'} rounded-md shadow box-border border-b h-8 flex justify-center items-center`}>
                            <Text size="normal">
                                {`${userDetails.emailVerified ? 'Verified Email' : 'Un-Verified Email'}`}
                            </Text>
                        </div>
                        <div onClick={logOut} className="bg-white border-b shadow cursor-pointer box-border hover:bg-red-100 border-red-300 rounded-md h-8 flex justify-center items-center">
                            <Text size="normal">
                                LogOut
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="w-fulll h-screen flex justify-center items-center">
            Loading
        </div>
    )
}
