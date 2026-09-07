import type { HealthResponse } from '@treevia/shared';

export interface HealthStatus {
    database: HealthResponse['database'];
}
