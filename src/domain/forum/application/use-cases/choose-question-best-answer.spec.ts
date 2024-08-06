import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { MakeQuestion } from "test/factories/make-question";
import { MakeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose question best answer tests", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    );
  });

  it("should be able to choose the question's best answer", async () => {
    const question = MakeQuestion();
    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(question.bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to choose another user's question best answer", async () => {
    const question = MakeQuestion();
    const answer = MakeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: "other-user",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
