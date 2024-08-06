import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
  }

  async delete(answer: Answer) {
    const indexId = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(indexId, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    return answer ?? null;
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id);

    this.items[index] = answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
