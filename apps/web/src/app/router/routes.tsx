import { AssessmentWorkspaceLayout } from '@/layouts/AssessmentWorkspaceLayout';
import { EducatorLayout } from '@/layouts/EducatorLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Routes, Route } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { DashboardPage } from '@/pages/educator/DashboardPage';
import { AssessmentsPage } from '@/pages/educator/AssessmentsPage';
import { AssessmentCreationPage } from '@/pages/educator/AssessmentCreationPage';
import { AssessmentEditPage } from '@/pages/educator/AssessmentEditPage';
import { AssessmentOverviewPage } from '@/pages/educator/AssessmentOverviewPage';
import { AssessmentQuestionsPage } from '@/pages/educator/AssessmentQuestionsPage';
import { AssessmentParticipantsPage } from '@/pages/educator/AssessmentParticipantsPage';
import { AssessmentResultsPage } from '@/pages/educator/AssessmentResultsPage';
import { AssessmentAnalyticsPage } from '@/pages/educator/AssessmentAnalyticsPage';
import { AssessmentBuilderPage } from '@/pages/educator/AssessmentBuilderPage';
import { SettingsPage } from '@/pages/educator/SettingsPage';
import { HomePage } from '@/pages/public/Home';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { JoinPage } from '@/pages/student/JoinPage';
import { ConfirmAssessmentPage } from '@/pages/student/ConfirmAssessmentPage';
import { ParticipantDetailsPage } from '@/pages/student/ParticipantDetailsPage';
import { AttemptInstructionsPage } from '@/pages/student/AttemptInstructionsPage';
import { AttemptExamPage } from '@/pages/student/AttemptExamPage';
import { AttemptSubmittedPage } from '@/pages/student/AttemptSubmittedPage';
import { AttemptResultPage } from '@/pages/student/AttemptResultPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const routes = (
    <Routes>
        <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<EducatorLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assessments" element={<AssessmentsPage />} />
                <Route path="/assessments/new" element={<AssessmentCreationPage />} />
                <Route path="/assessments/:assessmentId/edit" element={<AssessmentEditPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/assessments/:assessmentId" element={<AssessmentWorkspaceLayout />}>
                    <Route index element={<AssessmentOverviewPage />} />
                    <Route path="questions" element={<AssessmentQuestionsPage />} />
                    <Route path="participants" element={<AssessmentParticipantsPage />} />
                    <Route path="results" element={<AssessmentResultsPage />} />
                    <Route path="analytics" element={<AssessmentAnalyticsPage />} />
                </Route>
                <Route path="/assessments/:assessmentId/builder" element={<AssessmentBuilderPage />} />
            </Route>
        </Route>
        <Route>
            <Route path="/join" element={<JoinPage />} />
            <Route path="/join/:joinCode" element={<ConfirmAssessmentPage />} />
            <Route path="/join/:joinCode/details" element={<ParticipantDetailsPage />} />
            <Route path="/join/:joinCode/instructions" element={<AttemptInstructionsPage />} />
            <Route path="/attempt/:attemptId" element={<AttemptExamPage />} />
            <Route path="/attempt/:attemptId/submitted" element={<AttemptSubmittedPage />} />
            <Route path="/attempt/:attemptId/result" element={<AttemptResultPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export { ProtectedRoute, PublicOnlyRoute };
