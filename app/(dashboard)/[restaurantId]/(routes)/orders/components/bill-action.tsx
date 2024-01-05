import { Button } from "@/components/ui/button";
import { OrderColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";

interface CellActionProps {
    data: OrderColumn;
  }

const BillAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  const billSubmit = async () => {
    router.push(`/${params.restaurantId}/bill/${data.id}`)
  }

    return ( 
        <Button variant='outline' onClick={billSubmit}>View Bill</Button>
     );
}
 
export default BillAction;