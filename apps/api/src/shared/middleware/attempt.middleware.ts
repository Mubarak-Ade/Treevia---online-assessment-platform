import { type Request, type Response, type NextFunction } from 'express';
import { createHash } from 'crypto';
import { UnauthorizedError, ForbiddenError, GoneError } from '@treevia/shared';
import { AttemptRepository } from '../../modules/attempts/repository.js';
import { AssessmentRepository } from '../../modules/assessments/repository.js';

const attemptRepository = new AttemptRepository();
const assessmentRepository = new AssessmentRepository();

/**
 * Middleware that authenticates a student attempt using a Bearer token.
 * The token is a raw secret; we hash it to match the stored hash.
 *
 * Also enforces:
 * - The token's attempt matches the URL's :attemptId (prevents token reuse across attempts)
 * - The attempt is still IN_PROGRESS (auto-submits expired attempts)
 */
export async function requireAttemptAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing or malformed attempt token'));
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
        return next(new UnauthorizedError('Attempt token is required'));
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const attempt = await attemptRepository.findByToken(tokenHash);

    if (!attempt) {
        return next(new UnauthorizedError('Invalid attempt token'));
    }

    // Security: ensure the token belongs to the attempt being accessed
    const paramAttemptId = req.params.attemptId as string | undefined;
    if (paramAttemptId && attempt.id !== paramAttemptId) {
        return next(new ForbiddenError('Token does not match this attempt'));
    }

    // If attempt is expired (IN_PROGRESS but past duration), auto-submit it
    if (attempt.status === 'IN_PROGRESS') {
        const assessment = await assessmentRepository.findById(attempt.assessmentId);
        if (assessment) {
            const elapsed = Date.now() - new Date(attempt.startedAt).getTime();
            const durationMs = assessment.durationMinutes * 60 * 1000;
            if (elapsed > durationMs) {
                await attemptRepository.updateStatus(attempt.id, 'SUBMITTED');
                attempt.status = 'SUBMITTED';
                attempt.submittedAt = new Date();
            }
        }
    }

    req.attemptAuth = {
        attemptId: attempt.id,
        tokenHash,
        status: attempt.status,
        startedAt: attempt.startedAt,
    };

    next();
}
