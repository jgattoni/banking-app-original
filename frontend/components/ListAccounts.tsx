"use client";

import { useState, useEffect } from 'react';
import { useUser } from './UserProvider';
import Image from 'next/image';

const ListAccounts = () => {
    const loggedInUser = useUser();
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchUserBanks = async () => {
            if (!loggedInUser?.clerkId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bank_accounts/${loggedInUser.clerkId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user banks: ${response.statusText}`);
                }
                let fetchedBanks = await response.json();

                // Fetch institution details for each bank
                const banksWithInstitutionDetails = await Promise.all(fetchedBanks.map(async (bank: any) => {
                    if (bank.institution_id) {
                        try {
                            const institutionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/institutions/${bank.institution_id}`);
                            if (institutionResponse.ok) {
                                const institutionData = await institutionResponse.json();
                                return { ...bank, institution: institutionData };
                            } else {
                                console.error(`Failed to fetch institution for ${bank.institution_id}: ${institutionResponse.statusText}`);
                            }
                        } catch (error) {
                            console.error(`Error fetching institution for ${bank.institution_id}:`, error);
                        }
                    }
                    return bank; // Return bank as is if institution details can't be fetched
                }));

                setBanks(banksWithInstitutionDetails);
            } catch (error) {
                console.error("Error fetching user banks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isClient) {
            fetchUserBanks();
        }
    }, [loggedInUser, isClient]);

    if (!isClient || loading) {
        return <div>Loading accounts...</div>;
    }

    if (banks.length === 0) {
        return <div>No bank accounts found.</div>;
    }

    return (
        <div className="w-full max-w-4xl">
            <h3 className="text-xl font-semibold mb-4">Your Connected Accounts</h3>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Institution</th>
                        <th className="py-2 px-4 border-b">Account Name</th>
                        <th className="py-2 px-4 border-b">Mask</th>
                        <th className="py-2 px-4 border-b">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {banks.map((bank) => (
                        <tr key={bank.account_id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b flex items-center">
                                {bank.institution?.logo && (
                                    <Image
                                        src={`data:image/png;base64,${bank.institution.logo}`}
                                        alt={bank.institution.name || 'Institution Logo'}
                                        width={24}
                                        height={24}
                                        className="mr-2"
                                    />
                                )}
                                {bank.institution?.name || bank.bank_name}
                            </td>
                            <td className="py-2 px-4 border-b">{bank.official_name || bank.name}</td>
                            <td className="py-2 px-4 border-b">{bank.mask}</td>
                            <td className="py-2 px-4 border-b">${bank.current_balance?.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAccounts;
