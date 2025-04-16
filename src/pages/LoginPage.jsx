import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage; 