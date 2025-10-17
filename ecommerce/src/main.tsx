// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.tsx";
// import { BrowserRouter } from "react-router-dom";

// createRoot(document.getElementById("root")!).render(
//   <BrowserRouter>
//     <StrictMode>
//       <App />
//     </StrictMode>
//   </BrowserRouter>
// );

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import './index.css';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
