import { WeakTopicService } from './weak-topic.service';

describe('WeakTopicService', () => {
  it('selects weak topics deterministically and never crosses users', async () => {
    const findMany = jest.fn().mockResolvedValue([
      { userId: 'u1', topicId: 't-low', accuracy: 0.2, attemptCount: 3, topic: { name: 'Low' } },
      { userId: 'u1', topicId: 't-next', accuracy: 0.6, attemptCount: 5, topic: { name: 'Next' } },
    ]);
    const prisma = { userTopicStat: { findMany } } as never;
    const service = new WeakTopicService(prisma);
    const result = await service.list('u1');
    expect(result.map((row) => row.topicId)).toEqual(['t-low', 't-next']);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 'u1' }) }));
    expect(findMany).not.toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 'u2' }) }));
  });

  it('uses the same threshold for explicit topic entry', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const prisma = { userTopicStat: { findFirst } } as never;
    const service = new WeakTopicService(prisma);
    await expect(service.choose('u1', 't1')).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 'u1', topicId: 't1' }) }));
  });
});
