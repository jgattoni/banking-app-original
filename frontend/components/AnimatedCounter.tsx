'use client';

import CountUp from "react-countup";

const AnimatedCounter = ({amount}: {amount:number}) => {
    return (
        <p className={"w-full"}>
            <CountUp
                end={amount}
                decimal={"."}
                duration={2}
                prefix={"CHF "}
                decimals={2}
            />
        </p>
    )
}

export default AnimatedCounter