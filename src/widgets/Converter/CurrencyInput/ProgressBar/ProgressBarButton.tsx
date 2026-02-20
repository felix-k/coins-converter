import { memo } from "react";
import { Button } from "@mui/material";

type ProgressBarButtonProps = {
  title: string;
  percent: number;
  endValue: number;
  onClick?: (value: number) => void;
};

const ProgressBarButton = memo(
  ({ title, percent, endValue, onClick }: ProgressBarButtonProps) => {
    return (
      <Button
        variant="outlined"
        sx={(theme) => ({
          flex: 1,
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          borderColor: theme.palette.divider,

          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.divider,
          },

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            width: `${percent}%`,
            backgroundColor: theme.palette.primary.main,
            transition: "width 0.3s ease",
            zIndex: 0,
          },

          "& .labelBase": {
            position: "relative",
            zIndex: 1,
          },

          "& .labelInverted": {
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.primary.contrastText,
            clipPath: `inset(0 ${100 - percent}% 0 0)`,
            transition: "clip-path 0.3s ease",
            zIndex: 2,
            pointerEvents: "none",
          },
        })}
        onClick={() => onClick?.(endValue)}
      >
        <span className="labelBase">{title}</span>
        <span className="labelInverted">{title}</span>
      </Button>
    );
  },
);

export default ProgressBarButton;
