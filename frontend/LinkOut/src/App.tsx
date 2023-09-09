import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import NotFoundPage from "./shared/pages/NotFoundPage";
import StudentPage from "./applications/student/Page";
import StaffPage from "./applications/staff/Page";
import CompanyPage from "./applications/company/Page";

function App() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/student" element={<StudentPage />} />
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
