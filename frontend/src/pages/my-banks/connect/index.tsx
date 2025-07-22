import { useUser } from '@clerk/clerk-react';
import PlaidLink from '../../../components/PlaidLink';

const ConnectBank = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Connect Your Bank</h1>
      <PlaidLink user={user} />
    </div>
  );
};

export default ConnectBank;
