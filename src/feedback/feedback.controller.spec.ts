import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController, feedbackResponse } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let feedbackService: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          /**
           * We need to mock the return value from feedback service so we needed a way to mock the return type which is what I'm doing below
           */
          provide: FeedbackService,
          useValue: {
            getFeedbacks: jest.fn().mockReturnValue([]),
            updateFeedBack: jest.fn().mockReturnValue(feedbackResponse),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    feedbackService = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFeedbacks', () => {
    it('should construct filter object correctly', async () => {
      //we first mock the return values here
      const mockGetHOmes = jest.fn().mockReturnValue([]);
      jest
        .spyOn(feedbackService, 'getFeedbacks')
        .mockImplementation(mockGetHOmes);

      await controller.getFeedbacks('Bug');
      expect(mockGetHOmes).toBeCalledWith({
        category: 'Bug',
      });
    });
  });

  describe('updateFeedback', () => {
    const updateFeedbackParams = {
      title: 'hey',
      category: 'Bug',
      roadMap: 'InProgress',
      detail: 'hello world',
    } as const;

    it('should update feedback', async () => {
      const mockUpdateFeedback = jest.fn().mockReturnValue(feedbackResponse);
      jest
        .spyOn(feedbackService, 'updateFeedBack')
        .mockImplementation(mockUpdateFeedback);

      const mockRequest = {
        user: {
          id: 3,
        },
      };

      await controller.updateFeedBack(updateFeedbackParams, 5, mockRequest);

      expect(mockUpdateFeedback).toBeCalledWith(updateFeedbackParams, 5, 3);
    });
  });
});
