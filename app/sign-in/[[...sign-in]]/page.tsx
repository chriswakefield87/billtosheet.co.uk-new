import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to <span className="gradient-text">BillToSheet</span>
          </h1>
          <p className="text-gray-600">Sign in to manage your conversions</p>
        </div>
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
}
