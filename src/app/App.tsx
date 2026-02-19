import { Container } from "@mui/material";

import Converter from "@/widgets/Converter";
import { ErrorBoundary } from "@/shared/lib";
import AppBar from "@/widgets/AppBar";

import { ThemeProvider } from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Container
          disableGutters
          component="main"
          maxWidth={false}
          sx={{ height: "100vh" }}
        >
          <AppBar />
          <Converter />
        </Container>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
