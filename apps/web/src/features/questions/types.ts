export interface QuestionOption {
    id: string;
    questionId: string;
    optionText: string;
    position: number;
    isCorrect: boolean;
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
    options?: QuestionOption[];
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
        isCorrect: boolean;
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
        isCorrect: boolean;
        position: number;
    }[];
}

export interface QuestionReorderInput {
    questions: {
        id: string;
        position: number;
    }[];
}
