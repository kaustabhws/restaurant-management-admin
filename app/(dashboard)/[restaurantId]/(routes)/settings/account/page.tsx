import AccountForm from "../components/account-form";

interface AccountPageProps {
  params: {
    restaurantId: string;
  };
}

export default function AccountPage({ params }: AccountPageProps) {
  return (
    <div className="space-y-6">
      <AccountForm />
    </div>
  );
}
