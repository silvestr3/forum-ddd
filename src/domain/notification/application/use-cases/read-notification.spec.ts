import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { MakeNotification } from "test/factories/make-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;

let sut: ReadNotificationUseCase;

describe("Read notification use case tests", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to read notification", async () => {
    const notification = MakeNotification({
      recipientId: new UniqueEntityID("recipient-1"),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: "recipient-1",
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        readAt: expect.any(Date),
      })
    );
  });

  it("should not be able to read another user's notification", async () => {
    const notification = MakeNotification({
      recipientId: new UniqueEntityID("recipient-1"),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: "recipient-2",
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
