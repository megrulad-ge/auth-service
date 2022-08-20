import { Test, TestingModule } from '@nestjs/testing';
import { SentryFactoryService } from './sentry.service';
import { SentryService } from '@ntegral/nestjs-sentry';
import { NodeEnv } from '../../types';

describe('SentryFactoryService', () => {
  let service: SentryFactoryService;
  let captureMessageMock: unknown;

  beforeEach(async () => {
    captureMessageMock = jest.fn();
    const sentryMock = {
      instance: () => ({
        captureMessage: captureMessageMock,
      }),
    } as SentryService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SentryFactoryService,
          useValue: new SentryFactoryService(sentryMock),
        },
      ],
    }).compile();

    service = module.get<SentryFactoryService>(SentryFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call captureMessage on prod mode', () => {
    process.env.NODE_ENV = NodeEnv.PRODUCTION;
    service.captureMessage('test');
    expect(captureMessageMock).toHaveBeenCalled();
    process.env.NODE_ENV = NodeEnv.TEST;
  });

  it('should not call captureMessage on !prod mode', () => {
    service.captureMessage('test');
    expect(captureMessageMock).not.toHaveBeenCalled();
  });

  it('should not call captureMessage on SENTRY_FAKE_REPORT="enabled" mode', () => {
    process.env.SENTRY_FAKE_REPORT = 'enabled';
    service.captureMessage('test');
    expect(captureMessageMock).not.toHaveBeenCalled();
    process.env.SENTRY_FAKE_REPORT = 'disabled';
  });
});
