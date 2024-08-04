import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const indexId = this.items.findIndex(
      (item) => item.id === answerComment.id
    );

    this.items.splice(indexId, 1);
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    return answerComment ?? null;
  }
}
