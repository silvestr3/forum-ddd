import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { MakeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

let sut: DeleteQuestionUseCase;

describe("Delete question use case tests", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      MakeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      MakeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      questionId: "question-1",
      authorId: "author-1",
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete other user's question", async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "author-3",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
