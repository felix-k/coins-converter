import { Container } from "@mui/material";

import Converter from "@/widgets/Converter";
import AppBar from "@/widgets/AppBar";

import { ThemeProvider } from "./ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Container
        disableGutters
        component="main"
        maxWidth={false}
        sx={{ height: "100vh" }}
      >
        <AppBar />
        <Converter />
      </Container>
    </ThemeProvider>
  );
}

export default App;
