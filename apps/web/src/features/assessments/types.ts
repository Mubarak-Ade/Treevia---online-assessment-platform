export interface Assessment {
    id: string;
    creator_id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    status: "draft" | "published" | "closed";
    durationMinutes: number;
    joinCode: string;
    publishedAt: Date | null;
    courseCode?: string;
    cohort?: string;
}

export interface AssessmentFormData {
    title: string;
    description: string | null;
    durationMinutes: number;
}