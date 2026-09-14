import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from './assessment.api';
import { AssessmentInput } from '@treevia/validation';
import { Assessment } from './types';
import { assessmentKeys } from './queries';
import { toast } from 'sonner';

export function useCreateAssessment() {
    const queryClient = useQueryClient();

    return useMutation<Assessment, Error, AssessmentInput>({
        mutationFn: (data: AssessmentInput) => assessmentApi.create(data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all });
            toast.success('Assessment created successfully');
        },

        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to create assessment';
            toast.error(message);
        },
    });
}
