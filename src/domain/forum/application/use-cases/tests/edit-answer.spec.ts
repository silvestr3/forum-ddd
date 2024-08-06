import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { MakeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "../edit-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { MakeQuestionAttachment } from "test/factories/make-question-attachment";
import { MakeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit answer use case tests", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      MakeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-1",
      content: "First content",
      attachmentIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "First content",
    });
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
      ]
    );
  });

  it("should not be able to edit other user's answer", async () => {
    const newAnswer = MakeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-2",
      content: "First content",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
