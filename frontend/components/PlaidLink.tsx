"use client";

import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from 'react-plaid-link';
import {useCallback, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {createLinkToken, exchangePublicToken} from "@/lib/actions/user.actions";

const PlaidLink = ({user, variant}: PlaidLinkProps) => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);
            setToken(data?.linkToken);
        }
        getLinkToken()
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user})
        }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const {open, ready} = usePlaidLink(config);

    return (
        <>
            {variant === "primary" ? (
                <Button
                    onClick={() => open()}
                    disabled={!ready}
                    className={"plaidlink-primary"}>
                    Connect Bank
                </Button>
                ): variant === "ghost" ? (
                <Button className={"plaidlink-ghost"}>
                    Connect Bank
                </Button>
                ): (
                <Button className={"plaidlink-secondary"}>
                    Connect Bank
                </Button>
                )
            }
        </>
    )
}

export default PlaidLink;
