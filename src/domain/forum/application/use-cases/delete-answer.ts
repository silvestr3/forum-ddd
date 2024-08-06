import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answers-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface DeleteAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const question = await this.answersRepository.findById(answerId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(question);

    return right({});
  }
}
