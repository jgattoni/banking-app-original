import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import HeaderBox from '../components/HeaderBox';
import TotalBalanceBox from '../components/TotalBalanceBox';
import RightSidebar from '../components/RightSidebar';
import { accountService } from '../services/accountService';
import { userService } from '../services/userService';

const Home = () => {
  const { user } = useUser();
  const [loggedInUserProfile, setUserProfile] = useState<LoggedInUserProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userData = await userService.getUserById(user.id);
          setUserProfile(userData);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    const fetchAccounts = async () => {
      if (user) {
        try {
          const accountsData = await accountService.getAccountsByUserId(user.id);
          setAccounts(accountsData);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
    };

    if (user) {
      setLoading(true);
      Promise.all([fetchUserProfile(), fetchAccounts()]).finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const nbAccounts = accounts?.length || 0;
  const totalCurrentBalance = accounts?.reduce((total, account) => {
    const balance = typeof account.currentBalance === 'number' ? account.currentBalance : 0;
    return total + balance;
  }, 0) || 0;

  return (
    <section className="flex">
      <main className="flex-1">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedInUserProfile?.firstName || 'Guest'}
              subtext="Access and manage your account and transactions efficiently."
            />
            <TotalBalanceBox
              accounts={accounts || []}
              totalAccounts={nbAccounts}
              totalCurrentBalance={totalCurrentBalance}
            />
          </header>
        </div>
      </main>

      {user && (
        <RightSidebar
          user={{
            id: user.id,
            firstName: loggedInUserProfile?.firstName || '',
            lastName: loggedInUserProfile?.lastName || '',
            emailAddresses: loggedInUserProfile?.email || '',
          }}
          transactions={[]}
          banks={accounts || []}
        />
      )}
    </section>
  );
};

export default Home;
