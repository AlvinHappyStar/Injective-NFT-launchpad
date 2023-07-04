import {
  GLOBAL_TEXT_COLOR,
  NAVBAR_HEIGHT,
  NAVBAR_LINKS,
} from "./config-global";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SigningCosmWasmProvider } from './contexts/cosmwasm'

import Navbar from "./layouts/navbar";
import Launchpad from "./pages/launchpad";
import Preview from "./pages/preview";
import Nfts from "./pages/nfts";

function App() {
  return (
    <SigningCosmWasmProvider>
      <BrowserRouter>
        <Navbar />
        <Box
          sx={{
            paddingTop: `${NAVBAR_HEIGHT}px`,
            ".MuiTypography-root": {
              color: GLOBAL_TEXT_COLOR,
            },
          }}
        >
          <Switch>
            <Route
              path={NAVBAR_LINKS.launchpad.link}
              render={(props) => <Launchpad {...props} />}
            />
            <Route
              path={NAVBAR_LINKS.preview.link}
              render={(props) => <Preview {...props} />}
            />
            <Route
              path={NAVBAR_LINKS.nfts.link}
              render={(props) => <Nfts {...props} />}
            />
            <Redirect from="/" to={NAVBAR_LINKS.launchpad.link} />
          </Switch>
        </Box>
        <ToastContainer autoClose={3000} draggableDirection="x" />
      </BrowserRouter>
    </SigningCosmWasmProvider>
  );
}

export default App;
