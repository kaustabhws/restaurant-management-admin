import { 
  DollarSign, 
  IndianRupee, 
  Euro, 
  JapaneseYen, 
  PoundSterling, 
  RussianRuble, 
  PhilippinePeso 
} from "lucide-react";
import { cn } from "./utils";

type IconName =
  | "dollar"
  | "rupee"
  | "euro"
  | "yen"
  | "pound"
  | "ruble"
  | "peso";

type IconProps = {
  currency: IconName;
  className?: string;
  size?: number;
};

export const getCurrencyIcon = ({ currency, className, size }: IconProps): JSX.Element => {
  const icons: Record<IconName, React.ElementType> = {
    dollar: DollarSign,
    rupee: IndianRupee,
    euro: Euro,
    yen: JapaneseYen,
    pound: PoundSterling,
    ruble: RussianRuble,
    peso: PhilippinePeso,
  };

  const IconComponent = icons[currency];

  return <IconComponent className={cn(className)} size={size} />;
};
