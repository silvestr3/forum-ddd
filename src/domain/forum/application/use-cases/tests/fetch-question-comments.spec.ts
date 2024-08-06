import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "../fetch-question-comments";
import { InMemoryQuestioCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { MakeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestioCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestioCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question's comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      MakeQuestionComment({ questionId: new UniqueEntityID("question-1") })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(4);
  });

  it("Should be able to fetch paginated question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        MakeQuestionComment({ questionId: new UniqueEntityID("question-1") })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
