import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./shared/pages/NotFoundPage";
import StudentPage from "./applications/student/home";
import StaffPage from "./applications/staff/Page";
import { PrivateRoute } from "./shared/routes/PrivateRoute";
import UserPageLayout from "./shared/layout/UserPageLayout";
import HomePage from "./applications/home";
import StudentLogin from "./applications/login/student";
import CompanyLogin from "./applications/login/company";
import StudentSignup from "./applications/signup/student";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import CompanySignup from "./applications/signup/company";
import StudentProfile from "./applications/student/profile";
import { CompanyPage } from "./applications/company";
import { AllJobPage } from "./applications/company/AllJobPage";
import { CompanySettingPage } from "./applications/company/CompanySetting";
import Providers from "./Providers";

const queryClient = new QueryClient()

function App() {

  return (

    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <Providers>
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
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/company/jobs" element={<AllJobPage />} />
              <Route path="/company/setting" element={<CompanySettingPage />} />
              <Route
                path="/student/profile"
                element={
                  <PrivateRoute layout={UserPageLayout}>
                    <StudentProfile />
                  </PrivateRoute>
                } />
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/company" element={<CompanyLogin />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/signup/company" element={<CompanySignup />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="404" element={<NotFoundPage />} />

            </Routes>
          </BrowserRouter>
        </Providers>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App