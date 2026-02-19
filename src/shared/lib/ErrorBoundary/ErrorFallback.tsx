import { Box, Button, Typography } from "@mui/material";
import { type FallbackProps, useErrorBoundary } from "react-error-boundary";

const styles = {
  root: {
    py: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    py: 2,
    width: 1,
    maxWidth: "sm",
    textAlign: "center",
    color: "error.dark",
  },
};

const ErrorFallback = ({ error }: FallbackProps) => {
  const { resetBoundary } = useErrorBoundary();
  const message = error instanceof Error ? error.message : String(error);
  
  return (
    <Box sx={styles.root}>
      <Typography variant="h5">Произошла ошибка</Typography>
      <Typography sx={styles.message}>{message}</Typography>
      <Button sx={{ mt: 2 }} variant="contained" onClick={resetBoundary}>
        Попробовать снова
      </Button>
    </Box>
  );
};

export default ErrorFallback;
