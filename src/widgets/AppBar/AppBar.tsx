import { Stack, Toolbar, Typography, AppBar as MuiAppBar } from "@mui/material";

import { ThemeButton } from "@/shared/ui";

const styles = {
  appBar: {
    borderBottom: 1,
    borderColor: "divider",
    boxShadow: "none",
    color: "text.primary",
    backdropFilter: "blur(8px)",
    bgcolor: "background.transparent",
  },
};

const AppBar = () => {
  return (
    <>
      <MuiAppBar component="header" position="fixed" sx={styles.appBar}>
        <Toolbar sx={{ gap: 3 }}>
          <Stack direction="row" alignItems="center" minWidth={0}>
            <img src={`${import.meta.env.BASE_URL}logo.svg`} height="32px" />
            <Typography noWrap variant="h6" component="div" px={1}>
              Конвертер валют
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2} ml="auto">
            <ThemeButton />
          </Stack>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </>
  );
};

export default AppBar;
