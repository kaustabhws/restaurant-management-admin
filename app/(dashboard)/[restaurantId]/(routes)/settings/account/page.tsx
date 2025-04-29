import AccountForm from "../components/account-form";

interface AccountPageProps {
  params: {
    restaurantId: string;
  };
}

export default function AccountPage({ params }: AccountPageProps) {
  return (
    <div className="space-y-6 lg:max-w-2xl">
      <AccountForm />
    </div>
  );
}
