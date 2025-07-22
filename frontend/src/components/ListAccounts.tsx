import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const ListAccounts = () => {
    const { user } = useUser();
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserBanks = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bank_accounts/${user.id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch user banks: ${response.statusText}`);
                }
                const fetchedBanks = await response.json();
                console.log("Fetched banks:", fetchedBanks);

                if (!Array.isArray(fetchedBanks)) {
                    console.error("Expected an array but received:", fetchedBanks);
                    setBanks([]);
                } else {
                    setBanks(fetchedBanks);
                }
            } catch (error) {
                console.error("Error fetching user banks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserBanks();
    }, [user]);

    if (loading) {
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
                    {banks.map((bank, index) => {
                        console.log(`Rendering bank at index ${index}:`, bank);
                        return (
                            <tr key={bank.account_id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{bank.bank_name}</td>
                                <td className="py-2 px-4 border-b">{bank.official_name || bank.name}</td>
                                <td className="py-2 px-4 border-b">{bank.mask}</td>
                                <td className="py-2 px-4 border-b">${bank.current_balance?.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ListAccounts;
