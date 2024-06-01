import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import RegistrationForm from '../../components/forms/RegistrationForm';
import LoginForm from '../../components/forms/LoginForm';
import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';
import apiClient from '../../api/rest/api';
import setAuthenticationCookies from './Logic/setAuthenticationCookies';

function AuthPage() {
  const location = useLocation();
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const toggleForm = () => {
    setShowLoginForm((prev) => !prev);
  };
  const loginMutation = useMutation(apiClient.login);
  const registrationMutation = useMutation(apiClient.register);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    if (mode === 'login') {
      setShowLoginForm(true);
    } else if (mode === 'register') {
      setShowLoginForm(false);
    }
  }, [location]);

  const handleLogin = async (values: ILoginFormValues) => {
    try {
      const { token } = await loginMutation.mutateAsync(values);

      setAuthenticationCookies(token);

      navigate('/');
      toast.success('Login successful. Welcome!');
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const handleRegistration = async (values: IRegisterFormValues) => {
    try {
      await registrationMutation.mutateAsync(values);
      await handleLogin(values);
    } catch (error: any) {
      toast.error(
        error.response?.data ?? 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="h-screen w-full bg-welcome bg-no-repeat bg-cover bg-center flex justify-center items-center">
      {showLoginForm ? (
        <LoginForm
          onSubmit={handleLogin}
          toggleForm={toggleForm}
        />
      ) : (
        <RegistrationForm
          onSubmit={handleRegistration}
          toggleForm={toggleForm}
        />
      )}
    </div>
  );
}

export default AuthPage;
