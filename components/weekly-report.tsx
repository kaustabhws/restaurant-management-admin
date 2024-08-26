import { useEffect, useState } from "react";
import { getWeeklyRevenue } from "@/actions/get-weekly-graph-revenue";

interface WeeklyReportProps {
  restaurantId: string;
  month: string;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ restaurantId, month }) => {
  const [graphRevenue, setGraphRevenue] = useState<any>(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      const revenue = await getWeeklyRevenue(restaurantId, parseInt(month));
      setGraphRevenue(revenue);
    };

    fetchRevenue();
  }, [restaurantId, month]);

  return (
    <div>
      <h1>Weekly Revenue Report</h1>
      {graphRevenue ? (
        <p>{/* Render the revenue data here */}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeeklyReport;
