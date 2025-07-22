import { Link } from 'react-router-dom';

const PublicHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Banking App</h1>
      <div className="space-x-4">
        <Link to="/sign-in" className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Sign In
        </Link>
        <Link to="/sign-up" className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default PublicHomePage;
