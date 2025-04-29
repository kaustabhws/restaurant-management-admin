import Link from "next/link";
import { Button } from "./ui/button";

const AccessDenied = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">
        You do not have access to this page
      </h1>
      <p className="text-gray-600">
        Please contact your administrator if you believe this is a mistake.
      </p>
      <Link href={url}>
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
};

export default AccessDenied;
