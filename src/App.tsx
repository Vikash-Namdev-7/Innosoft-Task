import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import HomePage from '@/pages/HomePage';
import AgeVerification from '@/pages/AgeVerification';
import Layout from '@/layouts/Layout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import FooterPageRoute from '@/pages/FooterPageRoute';
import SportsPage from './pages/AllMatches';
import MatchDetails from './pages/MatchDetails';
import ForgetPassword from './pages/auth/ForgotPassword';
import MyBets from './pages/MyBets';
import Profile from './pages/Profile';
import StakeSettings from './pages/StakeSettings';
import AccountStatement from './pages/AccountStatement';

export function App() {
  return (
    <>

      <Routes>
        {/* Age verification */}
        <Route path="/" element={<AgeVerification />} />

        {/* Public authentication pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Protected application pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />

            <Route path="/my-bets" element={<MyBets />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/sport/inplay" element={<SportsPage />} />
            <Route path="/sport/:sportName" element={<SportsPage />} />
            <Route path="/:sportName" element={<SportsPage />} />


            <Route path="/match/:matchId" element={<MatchDetails />} />

            <Route path="/stake-settings" element={<StakeSettings />} />
            <Route path="/stack-settings" element={<Navigate to="/stake-settings" replace />} />
            <Route path="/account-statement" element={<AccountStatement />} />
            <Route path="/statement" element={<Navigate to="/account-statement" replace />} />

            <Route
              path="/about"
              element={<FooterPageRoute slug="about" />}
            />
            <Route
              path="/rejection-and-decline"
              element={<FooterPageRoute slug="rejection-and-decline" />}
            />

            <Route
              path="/responsible-gaming"
              element={<FooterPageRoute slug="responsible-gaming" />}
            />

            <Route
              path="/terms-and-conditions"
              element={<FooterPageRoute slug="terms-and-conditions" />}
            />
          </Route>
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
