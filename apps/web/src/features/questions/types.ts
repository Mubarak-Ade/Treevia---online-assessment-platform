export interface QuestionOption {
    id: string;
    questionId: string;
    optionText: string;
    position: number;
    isCorrect: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    id: string;
    assessmentId: string;
    questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    questionText: string;
    points: number;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionWithOptions extends Question {
    options?: QuestionOption[];
}

export interface QuestionInput {
    questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    questionText: string;
    points: number;
    position: number;
    options: {
        optionText: string;
        isCorrect: number;
        position: number;
    }[];
}

export interface QuestionUpdateInput {
    questionType?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    questionText?: string;
    points?: number;
    position?: number;
    options?: {
        optionText: string;
        isCorrect: number;
        position: number;
    }[];
}

export interface QuestionReorderInput {
    order: string[];
}
