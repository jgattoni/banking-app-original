"use client";

import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from 'react-plaid-link';
import {useCallback, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button";
import {createLinkToken, exchangePublicToken, savePlaidAccounts} from "@/lib/actions/user.actions";

const PlaidLink = ({user, variant, accessToken}: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState("");

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user, accessToken);
            setToken(data?.linkToken);
        }
        getLinkToken()
    }, [user, accessToken])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        const { accessToken, itemId } = await exchangePublicToken({ publicToken: public_token });
        await savePlaidAccounts({ accessToken, itemId, user });
        router.push("/my-banks"); // Redirect to the My Banks page
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
                    variant="default">
                    Connect Bank
                </Button>
                ): variant === "ghost" ? (
                <Button variant="ghost">
                    Connect Bank
                </Button>
                ): (
                <Button variant="secondary">
                    Connect Bank
                </Button>
                )
            }
        </>
    )
}

export default PlaidLink;
