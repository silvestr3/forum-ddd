import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { MakeQuestion } from "test/factories/make-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get question by slug use case tests", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to find a question by slug", async () => {
    const newQuestion = MakeQuestion({
      title: "Example question test",
    });

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question-test",
    });

    expect(result.value?.question.id).toBeTruthy();
    expect(result.value?.question.title).toEqual(newQuestion.title);
  });
});
