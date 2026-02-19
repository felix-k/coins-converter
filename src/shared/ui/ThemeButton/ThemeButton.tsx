import { useContext } from "react";
import { type SxProps, IconButton, useTheme } from "@mui/material";
import { ThemeContext } from "@/app/ThemeProvider";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const ThemeButton = ({ sx }: { sx?: SxProps }) => {
  const theme = useTheme();
  const context = useContext(ThemeContext);

  return (
    <IconButton sx={sx} color="inherit" onClick={context.toggleColorMode}>
      {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeButton;
