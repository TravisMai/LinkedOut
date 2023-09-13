import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./shared/pages/NotFoundPage";
import StudentPage from "./applications/student";
import StaffPage from "./applications/staff/Page";
import CompanyPage from "./applications/company/Page";
import { PrivateRoute } from "./shared/routes/PrivateRoute";
import UserPageLayout from "./shared/layout/UserPageLayout";
import HomePage from "./applications/home";
import StudentLogin from "./applications/login/student";
import CompanyLogin from "./applications/login/company";

function App() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/student"
              element={
                <PrivateRoute layout={UserPageLayout}>
                  <StudentPage />
                </PrivateRoute>
              }
            />
            <Route path="/staff" element={<StaffPage />} />
            <Route
              path="/company"
              element={
                <PrivateRoute layout={UserPageLayout}>
                  <CompanyPage />
                </PrivateRoute>
              } />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/company" element={<CompanyLogin />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="404" element={<NotFoundPage />} />

          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

export default App
