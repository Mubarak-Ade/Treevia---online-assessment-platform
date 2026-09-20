import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assessmentApi, Participant } from "./assessment.api"
import { Assessment } from "./types"
import { AssessmentInput } from "@treevia/validation"
import { toast } from "sonner"

export const assessmentKeys = {
    all: ['assessments'] as const,
    byId: (id: string) => ['assessments', id] as const,
    participants: (id: string) => ['assessments', id, 'participants'] as const,
}

export const useAssessments = () => {
    return useQuery<Assessment[]>({
        queryKey: assessmentKeys.all,
        queryFn: assessmentApi.getAll
    })
}

export const useAssessmentById = (id: string) => {
    return useQuery<Assessment>({
        queryKey: assessmentKeys.byId(id),
        queryFn: () => assessmentApi.getById(id),
        enabled: !!id
    })
}

export const useDeleteAssessment = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, string>({
        mutationFn: assessmentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
            toast.success("Assessment deleted successfully")
        },
        onError: () => {
            toast.error("Failed to delete assessment")
        }
    })
}

export const useUpdateAssessment = () => {
    const queryClient = useQueryClient()

    return useMutation<Assessment, Error, { id: string; data: AssessmentInput }>({
        mutationFn: ({ id, data }) => assessmentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
            toast.success("Assessment updated successfully")
        },
        onError: () => {
            toast.error("Failed to update assessment")
        }
    })
}

export const usePublishAssessment = () => {
    const queryClient = useQueryClient()

    return useMutation<Assessment, Error, string>({
        mutationFn: assessmentApi.publish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
            toast.success("Assessment published")
        },
        onError: () => {
            toast.error("Failed to publish assessment")
        }
    })
}

export const useUnpublishAssessment = () => {
    const queryClient = useQueryClient()

    return useMutation<Assessment, Error, string>({
        mutationFn: assessmentApi.unpublish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
            toast.success("Assessment unpublished")
        },
        onError: () => {
            toast.error("Failed to unpublish assessment")
        }
    })
}

export const useCloseAssessment = () => {
    const queryClient = useQueryClient()

    return useMutation<Assessment, Error, string>({
        mutationFn: assessmentApi.close,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: assessmentKeys.all })
            toast.success("Assessment closed")
        },
        onError: () => {
            toast.error("Failed to close assessment")
        }
    })
}

export const useParticipants = (assessmentId: string) => {
    return useQuery<Participant[]>({
        queryKey: assessmentKeys.participants(assessmentId),
        queryFn: () => assessmentApi.getParticipants(assessmentId),
        enabled: !!assessmentId,
    })
}