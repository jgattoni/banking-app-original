import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import SignInPage from './pages/sign-in';
import SignUpPage from './pages/sign-up';
import Dashboard from './pages';
import MyBanks from './pages/my-banks';
import ConnectBank from './pages/my-banks/connect';
import PaymentTransfer from './pages/payment-transfer';
import TransactionHistory from './pages/transaction-history';
import PublicHomePage from './pages/public-home';
import PrivateRoute from './components/PrivateRoute';
import SidebarLayout from "./components/SidebarLayout";

function App() {
  const { isSignedIn } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <PublicHomePage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-banks" element={<MyBanks />} />
          <Route path="/my-banks/connect" element={<ConnectBank />} />
          <Route path="/payment-transfer" element={<PaymentTransfer />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
