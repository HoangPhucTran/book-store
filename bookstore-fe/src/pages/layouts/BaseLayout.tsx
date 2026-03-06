import { Outlet } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Navbar from "../../components/layouts/Navbar";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                "&:focus": {
                    outline: "none",
                },
            },
        },
    },
  },
});

export default function BaseLayout() {

    return (
        <ThemeProvider theme={theme}>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header />

                {/* Body */}
                <div style={{ display: 'flex', flex: 1 }}>
                    <Navbar />

                    <main style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </ThemeProvider>
    )
}