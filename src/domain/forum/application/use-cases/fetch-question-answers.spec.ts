import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { MakeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch question answers", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fethc question's answers", async () => {
    await inMemoryAnswersRepository.create(
      MakeAnswer({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryAnswersRepository.create(
      MakeAnswer({ questionId: new UniqueEntityID("question-2") })
    );
    await inMemoryAnswersRepository.create(
      MakeAnswer({ questionId: new UniqueEntityID("question-3") })
    );
    await inMemoryAnswersRepository.create(
      MakeAnswer({ questionId: new UniqueEntityID("question-1") })
    );

    const { answers } = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(answers).toHaveLength(2);
  });

  it("Should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        MakeAnswer({ questionId: new UniqueEntityID("question-1") })
      );
    }

    const { answers } = await sut.execute({
      page: 2,
      questionId: "question-1",
    });

    expect(answers).toHaveLength(2);
  });
});
