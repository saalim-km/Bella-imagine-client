import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@radix-ui/react-tooltip";
  import '../../assets/css/tooltip.css'
  
  interface ToolTipProps {
    content: string;
    element: any;
  }
  
  const ToolTip = ({ content, element }: ToolTipProps) => {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{element}</TooltipTrigger>
          <TooltipContent className="TooltipContent">
            <p>{content}</p>
            <div className="TooltipArrow" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
export default ToolTip;  