import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Join <span className="gradient-text">BillToSheet</span>
          </h1>
          <p className="text-gray-600">Start converting invoices today</p>
        </div>
        <SignUp routing="path" path="/sign-up" />
      </div>
    </div>
  );
}
