export interface Attempt {
    id: string;
    assessmentId: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
    token: string;
    startedAt: string;
    submittedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AttemptDetail {
    id: string;
    assessmentId: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    status: string;
    startedAt: string;
    submittedAt: string | null;
    durationMinutes: number;
    expiresAt: string;
    isExpired: boolean;
    timeRemainingMs: number;
    createdAt: string;
}

export interface AttemptQuestion {
    id: string;
    number: number;
    text: string;
    options: { id: string; text: string }[];
}

export interface CreateAttemptPayload {
    assessmentId: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
}

export interface SaveAnswerPayload {
    questionId: string;
    selectedOptionId: string;
}
