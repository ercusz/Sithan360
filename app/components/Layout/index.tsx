import { Box, useColorMode } from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import NavBar from "../NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const theme = useTheme()

  return (
      <Box
        height="100vh" 
        display="flex" 
        flexDirection="column"
      >
        <NavBar colorMode={colorMode} toggleColorMode={toggleColorMode} theme={theme}></NavBar>

        <Box as="main" flex={1} overflow="auto">
          {children}
        </Box>
      </Box>
  );
}
