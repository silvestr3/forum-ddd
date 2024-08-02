import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

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
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    return question ?? null;
  }
}
