import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit question use case tests", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "author-1",
      content: "First content",
      title: "Different title",
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Different title",
      content: "First content",
    });
  });

  it("should not be able to edit other user's question", async () => {
    const newQuestion = MakeQuestion(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1")
    );

    inMemoryQuestionsRepository.create(newQuestion);

    await expect(() =>
      sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: "author-2",
        content: "First content",
        title: "Different title",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
