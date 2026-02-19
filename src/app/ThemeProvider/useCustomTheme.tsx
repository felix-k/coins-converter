/* eslint-disable @typescript-eslint/no-empty-object-type */

import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { type PaletteMode, darkScrollbar, useMediaQuery } from "@mui/material";

type CustomPaletteType = {
  border: string;
};

declare module "@mui/material/styles" {
  interface Palette extends CustomPaletteType {}
  interface PaletteOptions extends CustomPaletteType {}
  interface TypeBackground {
    transparent: string;
  }
  interface BreakpointOverrides {
    notebook: true;
    desktop: true;
  }
}

const useCustomTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useLocalStorage<PaletteMode>(
    "mode",
    prefersDarkMode ? "dark" : "light",
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(mode === "light" ? "dark" : "light");
      },
    }),
    [mode, setMode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            notebook: 1000,
            lg: 1200,
            desktop: 1400,
            xl: 1536,
          },
        },
        palette: {
          mode,
          background: {
            ...(mode === "light" && { default: grey[100] }),
            transparent:
              mode === "light"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(18, 18, 18, 0.8)",
          },
          border:
            mode === "light"
              ? "rgba(0, 0, 0, 0.23)"
              : "rgba(255, 255, 255, 0.23)",
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                ...darkScrollbar(
                  mode === "light"
                    ? {
                        track: grey[200],
                        thumb: grey[400],
                        active: grey[400],
                      }
                    : undefined,
                ),
                scrollbarWidth: "thin",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "100px",
              },
            },
          },
        },
      }),
    [mode],
  );

  return { theme, colorMode };
};

export default useCustomTheme;
