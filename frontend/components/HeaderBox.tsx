"use client";

import { useUser } from "@/components/UserProvider";

const HeaderBox = ({type = "title", title, subtext}: HeaderBoxProps ) => {
    const loggedInUser = useUser();

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
                {title}
                {type === 'greeting' && (
                    <span className="text-bankGradient">
                        &nbsp;{loggedInUser?.firstName || 'Guest'}</span>
                )}
            </h1>
            <p className="text-sm font-normal text-gray-600 lg:text-base">{subtext}</p>
        </div>
    )
}

export default HeaderBox