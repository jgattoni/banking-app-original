import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return <SignIn routing="path" path="/sign-in" />;
};

export default SignInPage;
