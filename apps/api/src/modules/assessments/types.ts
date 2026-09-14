import { Assessment, assessStatus, NewAssessment } from "../../shared/db/schema/assessment.js";

export interface IAssessmentRepository {
    create(data: NewAssessment): Promise<Assessment>,
    findByCreator(userId: string): Promise<Assessment>,
    findById(id: string): Promise<Assessment>,
    findAll(userId: string): Promise<Assessment[]>,
    findByJoinCode(code: string): Promise<string>,
    update(data: Partial<NewAssessment>, assessmentId: string): Promise<Assessment>,
    delete(assessmentId: string): Promise<Assessment>,
    publish(assessmentId: string): Promise<Assessment>,
    closed(assessmentId: string): Promise<Assessment>,
}
