"use client";

import { useUser } from "@/components/UserProvider";

const HeaderBox = ({type = "title", title, subtext}: HeaderBoxProps ) => {
    const loggedInUser = useUser();

    return (
        <div className={"header-box"}>
            <h1 className={"header-box-title"}>
                {title}
                {type === 'greeting' && (
                    <span className="text-bankGradient">
                        &nbsp;{loggedInUser?.firstName || 'Guest'}</span>
                )}
            </h1>
            <p className={"header-box-subtext"}>{subtext}</p>
        </div>
    )
}

export default HeaderBox