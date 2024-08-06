import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
  attachmentIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(currentAttachments);

    const answerAttachmentsUpdated = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(answerAttachmentsUpdated);
    answer.attachments = answerAttachmentList;

    answer.content = content;

    this.answersRepository.save(answer);

    return right({ answer });
  }
}
