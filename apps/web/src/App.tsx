import { Routes, Route } from 'react-router';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { EducatorLayout } from './layouts/EducatorLayout';
import { AssessmentWorkspaceLayout } from './layouts/AssessmentWorkspaceLayout';
import { StudentLayout } from './layouts/StudentLayout';

// Protection
import { ProtectedRoute } from './app/router/ProtectedRoute';

// Public routes
import { HomePage } from './pages/public/Home';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Educator routes
import { DashboardPage } from './pages/educator/DashboardPage';
import { AssessmentsPage } from './pages/educator/AssessmentsPage';
import { AssessmentOverviewPage } from './pages/educator/AssessmentOverviewPage';
import { AssessmentQuestionsPage } from './pages/educator/AssessmentQuestionsPage';
import { AssessmentParticipantsPage } from './pages/educator/AssessmentParticipantsPage';
import { AssessmentResultsPage } from './pages/educator/AssessmentResultsPage';
import { AssessmentAnalyticsPage } from './pages/educator/AssessmentAnalyticsPage';
import { AssessmentBuilderPage } from './pages/educator/AssessmentBuilderPage';
import { SettingsPage } from './pages/educator/SettingsPage';

// Student routes
import { JoinPage } from './pages/student/JoinPage';
import { JoinCodeEntryPage } from './pages/student/JoinCodeEntryPage';
import { AttemptInstructionsPage } from './pages/student/AttemptInstructionsPage';
import { AttemptExamPage } from './pages/student/AttemptExamPage';
import { AttemptSubmittedPage } from './pages/student/AttemptSubmittedPage';
import { AttemptResultPage } from './pages/student/AttemptResultPage';

// Error Pages
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './features/auth/auth.hook';

export default function App() {
    
    return (
        <ErrorBoundary>
            <Routes>
                {/* Public Layout */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Educator Protected Routes: Unauthenticated educators cannot access */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<EducatorLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/assessments" element={<AssessmentsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />

                        {/* Nested Assessment Workspace Layout */}
                        <Route path="/assessments/:assessmentId" element={<AssessmentWorkspaceLayout />}>
                            <Route index element={<AssessmentOverviewPage />} />
                            <Route path="questions" element={<AssessmentQuestionsPage />} />
                            <Route path="participants" element={<AssessmentParticipantsPage />} />
                            <Route path="results" element={<AssessmentResultsPage />} />
                            <Route path="analytics" element={<AssessmentAnalyticsPage />} />
                        </Route>

                        {/* Dedicated Focused Assessment Builder */}
                        <Route path="/assessments/:assessmentId/builder" element={<AssessmentBuilderPage />} />
                    </Route>
                </Route>

                {/* Student Clean Layout */}
                <Route element={<StudentLayout />}>
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/join/:joinCode" element={<JoinCodeEntryPage />} />
                    <Route path="/attempt/:attemptId/instructions" element={<AttemptInstructionsPage />} />
                    <Route path="/attempt/:attemptId" element={<AttemptExamPage />} />
                    <Route path="/attempt/:attemptId/submitted" element={<AttemptSubmittedPage />} />
                    <Route path="/attempt/:attemptId/result" element={<AttemptResultPage />} />
                </Route>

                {/* Global 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
}
