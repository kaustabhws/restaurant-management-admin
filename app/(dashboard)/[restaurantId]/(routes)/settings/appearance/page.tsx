import AppearanceForm from "../components/appearance-form";

interface AppearancePageProps {
  params: {
    restaurantId: string;
  };
}

export default function AppearancePage({ params }: AppearancePageProps) {
  return (
    <div className="space-y-6">
      <AppearanceForm restaurantId={params.restaurantId} />
    </div>
  );
}
