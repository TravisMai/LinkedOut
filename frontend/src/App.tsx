import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./shared/pages/NotFoundPage";
import StudentPage from "./applications/student/home";
import StaffPage from "./applications/staff/Page";
import UserPageLayout from "./shared/layout/UserPageLayout";
import HomePage from "./applications/home";
import StudentLogin from "./applications/login/student";
import CompanyLogin from "./applications/login/company";
import StudentSignup from "./applications/signup/student";
import { QueryClient, QueryClientProvider } from 'react-query'
import CompanySignup from "./applications/signup/company";
import StudentProfile from "./applications/student/profile";
import { CompanyPage } from "./applications/company";
import { AllJobPage } from "./applications/company/AllJobPage";
import { CompanySettingPage } from "./applications/company/CompanySetting";
import Providers from "./Providers";
import StudentJobsPage from "./applications/student/jobs";
import StudentMessage from "./applications/student/message";
import JobDisplay from "./applications/student/jobs/JobDisplay";
import AddJob from "./applications/company/AddJob";
import JobDisplayCompany from "./applications/company/JobDisplay";
import { ApplicantsPage } from "./applications/company/ApplicantsPage";
import DisplayApplicant from "./applications/company/DisplayApplicant";
import CompanyMessage from "./applications/company/CompanyMessage";
import StaffLogin from "./applications/login/staff";
import PrivateRoute from "./shared/routes/PrivateRoute";

const queryClient = new QueryClient()

function App() {

  return (

    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <Providers>
          <BrowserRouter>
            <Routes>

              {/* Home route */}
              <Route path="/" element={<HomePage />} />

              {/* Student routes */}
              <Route path="/student"
                element={
                  <PrivateRoute>
                    <UserPageLayout>
                      <StudentPage />
                    </UserPageLayout>
                  </PrivateRoute>
                } />
              <Route path="/student/profile"
                element={
                  <PrivateRoute>
                    <UserPageLayout>
                      <StudentProfile />
                    </UserPageLayout>
                  </PrivateRoute>
                } />
              <Route path="/student/jobs"
                element={
                  <PrivateRoute>
                    <UserPageLayout>
                      <StudentJobsPage />
                    </UserPageLayout>
                  </PrivateRoute>

                } />
              <Route path="/student/jobs/:jobId"
                element={
                  <PrivateRoute>
                    <UserPageLayout>
                      <JobDisplay />
                    </UserPageLayout>
                  </PrivateRoute>
                } />
              <Route path="/student/message"
                element={
                  <PrivateRoute>
                    <UserPageLayout>
                      <StudentMessage />
                    </UserPageLayout>
                  </PrivateRoute>
                } />

              {/* Company routes */}
              <Route path="/company"
                element={
                  <PrivateRoute>
                      <CompanyPage />
                  </PrivateRoute>
                } />
              <Route path="/company/jobs"
                element={
                  <PrivateRoute>
                    <AllJobPage />
                  </PrivateRoute>
                } />
              <Route path="/company/applicant"
                element={
                  <PrivateRoute>
                    <ApplicantsPage />
                  </PrivateRoute>
                } />
              <Route path="/company/applicant/:applicantId"
                element={
                  <PrivateRoute>
                    <DisplayApplicant />
                  </PrivateRoute>
                } />
              <Route path="/company/message"
                element={
                  <PrivateRoute>
                    <CompanyMessage />
                  </PrivateRoute>
                } />
              <Route path="/company/jobs/add"
                element={
                  <PrivateRoute>
                    <AddJob />
                  </PrivateRoute>
                } />
              <Route path="/company/jobs/:jobId"
                element={
                  <PrivateRoute>
                    <JobDisplayCompany />
                  </PrivateRoute>
                } />
              <Route path="/company/setting"
                element={
                  <PrivateRoute>
                    <CompanySettingPage />
                  </PrivateRoute>
                } />

              {/* Staff routes */}
              <Route path="/staff"
                element={
                  <PrivateRoute>
                      <StaffPage />
                  </PrivateRoute>
                } />

              {/* Login, signin routes */}
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/company" element={<CompanyLogin />} />
              <Route path="/login/staff" element={<StaffLogin />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/signup/company" element={<CompanySignup />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </BrowserRouter>
        </Providers>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App
