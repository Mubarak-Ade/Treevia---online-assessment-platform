// Error classes are defined in @treevia/shared so they can be used
// consistently across both the API and the web client (e.g. in the Axios interceptor).
export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
} from '@treevia/shared';
