import {PropsWithChildren} from "react";

interface StepProps {
    value: number;
    index: number;
  }
  
 export const Step = (props: PropsWithChildren<StepProps>): React.JSX.Element | null => {
    const {children, index, value} = props;
    return index === value ? <>{children}</> : null;
  }