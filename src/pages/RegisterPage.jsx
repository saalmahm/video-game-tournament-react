import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create a New Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage; 