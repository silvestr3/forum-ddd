import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { MakeQuestion } from "test/factories/make-question";
import { InMemoryQuestioCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "../comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestioCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question tests", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestioCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = MakeQuestion();
    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: "author-1",
      content: "This is a test comment",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      "This is a test comment"
    );
  });
});
