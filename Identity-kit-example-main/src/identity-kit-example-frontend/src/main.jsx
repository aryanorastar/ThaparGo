
// WITHOUT REDUX 

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { AuthProvider } from "./StateManagement/useContext/useClient";
import {
  IdentityKitProvider,
  IdentityKitTheme,
} from "@nfid/identitykit/react";
import {
  IdentityKitAuthType,
  NFIDW,
  Plug,
  InternetIdentity,
} from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

const signers = [NFIDW, Plug, InternetIdentity];
const canisterID = import.meta.env.CANISTER_ID_IDENTITY_KIT_EXAMPLE_BACKEND;
ReactDOM.createRoot(document.getElementById('root')).render(
  <IdentityKitProvider
    signers={signers}
    theme={IdentityKitTheme.SYSTEM}
    authType={IdentityKitAuthType.DELEGATION}
    signerClientOptions={{
      targets: [canisterID],
      retryTimes: 2
    }}
  >
  <React.StrictMode>
      <AuthProvider>
    <App />
      </AuthProvider>
  </React.StrictMode>,
  </IdentityKitProvider>
);











// // IF YOU USE REDUX TOOKKIT




// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.scss';
// import Modal from 'react-modal';
// import { Provider } from "react-redux";
// import store, { persistor } from "./StateManagement/Redux/Store";
// import { PersistGate } from "redux-persist/integration/react";
// import { AuthProvider } from "./StateManagement/useContext/useClient";
// import {
//   IdentityKitProvider,
//   IdentityKitTheme,
// } from "@nfid/identitykit/react";
// import { BrowserRouter } from 'react-router-dom';
// import {
//   IdentityKitAuthType,
//   NFIDW,
//   Plug,
//   InternetIdentity,
// } from "@nfid/identitykit";
// import "@nfid/identitykit/react/styles.css";

// Modal.setAppElement('#root');

// const signers = [NFIDW, Plug, InternetIdentity];
// const canisterID = import.meta.env.CANISTERID_BAKEND;

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <IdentityKitProvider
//     signers={signers}
//     theme={IdentityKitTheme.SYSTEM}
//     authType={IdentityKitAuthType.DELEGATION}
//     signerClientOptions={{
//       targets: [canisterID],
//       retryTimes: 2
//     }}
//   >
//     <React.StrictMode>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <AuthProvider>
//             <BrowserRouter>
//               <App />
//             </BrowserRouter>
//           </AuthProvider>
//         </PersistGate>
//       </Provider>
//     </React.StrictMode>
//   </IdentityKitProvider>
// );
