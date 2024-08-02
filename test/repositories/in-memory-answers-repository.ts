import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);
  }

  async delete(answer: Answer) {
    const indexId = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(indexId, 1);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    return answer ?? null;
  }
}
