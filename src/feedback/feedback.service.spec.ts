import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService, feedBackReturnValue } from './feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { mockCreateResponseType, mockGetFeedbacks } from './mockData';
import { NotFoundException } from '@nestjs/common';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: PrismaService,
          useValue: {
            feedback: {
              findMany: jest.fn().mockReturnValue(mockGetFeedbacks),
              create: jest.fn().mockReturnValue(mockCreateResponseType),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getFeedbacks', () => {
    const filters = {
      category: 'Bug',
    };

    it('should call prisma feedback.findMany wth correct parameters', async () => {
      const mockPrismaFindManyFeedback = jest
        .fn()
        .mockReturnValue(mockGetFeedbacks);
      jest
        .spyOn(prismaService.feedback, 'findMany')
        .mockImplementation(mockPrismaFindManyFeedback);

      await service.getFeedbacks({ category: 'Bug' });
      expect(mockPrismaFindManyFeedback).toBeCalledWith({
        where: filters,
        select: {
          ...feedBackReturnValue,
          upvotes: true,
          _count: {
            select: {
              Comment: true,
            },
          },
        },
      });
    });
  });

  describe('createFeedback', () => {
    const mockFeedbackParams = {
      title: 'Another Banger',
      category: 'UI',
      detail: 'You look takeaway',
      userId: 3,
    } as const;
    it('should call prisma feedback.create with the correct payload', async () => {
      const mockCreateFeedback = jest
        .fn()
        .mockReturnValue(mockCreateResponseType);

      jest
        .spyOn(prismaService.feedback, 'create')
        .mockImplementation(mockCreateFeedback);

      await service.createFeedback(mockFeedbackParams, 3);

      expect(mockCreateFeedback).toBeCalledWith({
        data: { ...mockFeedbackParams },
        select: {
          ...feedBackReturnValue,
          Comment: {
            select: { _count: true },
          },
        },
      });
    });
  });

  describe('getFeedback', () => {
    it('should throw NotFoundException when invalid ID is provided', async () => {
      jest
        .spyOn(prismaService.feedback, 'findUnique')
        .mockReturnValueOnce(null);

      await expect(service.getFeedback(2)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
