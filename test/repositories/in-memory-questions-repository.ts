import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    return question ?? null;
  }

  async delete(question: Question) {
    const indexId = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(indexId, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    return question ?? null;
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items[index] = question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
