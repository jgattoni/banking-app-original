import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { createLinkToken, exchangePublicToken, savePlaidAccounts } from '../lib/actions/user.actions';
import { UserResource } from '@clerk/types';

interface PlaidLinkProps {
    user: UserResource;
    variant?: "primary" | "ghost";
    accessToken?: string;
}

const PlaidLink = ({ user, variant, accessToken }: PlaidLinkProps) => {
    const navigate = useNavigate();
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
        navigate("/my-banks"); // Redirect to the My Banks page
    }, [user, navigate])

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === "primary" ? (
                <Button
                    onClick={() => open()}
                    disabled={!ready}
                    variant="default">
                    Connect Bank
                </Button>
            ) : variant === "ghost" ? (
                <Button variant="ghost">
                    Connect Bank
                </Button>
            ) : (
                <Button variant="secondary">
                    Connect Bank
                </Button>
            )
            }
        </>
    )
}

export default PlaidLink;
