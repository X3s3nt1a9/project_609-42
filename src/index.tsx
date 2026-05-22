import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Frame } from "./screens/Frame";
import { AdminProvider } from "./screens/Admin/admin-data";
import { AdminRoutes } from "./screens/Admin/AdminRoutes";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frame />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  </StrictMode>,
);
