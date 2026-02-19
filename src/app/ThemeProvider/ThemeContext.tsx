import { createContext } from "react";

const ThemeContext = createContext({ toggleColorMode: () => {} });

ThemeContext.displayName = "ThemeContext";

export default ThemeContext;
