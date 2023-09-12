import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./shared/pages/NotFoundPage";
import StudentPage from "./applications/student";
import StaffPage from "./applications/staff/Page";
import CompanyPage from "./applications/company/Page";
import { PrivateRoute } from "./shared/routes/PrivateRoute";
import StudentPageLayout from "./shared/layout/studentLayout";

function App() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/student"
              element={
                <PrivateRoute layout={StudentPageLayout}>
                  <StudentPage />
                </PrivateRoute>
              }
            />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="404" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App
