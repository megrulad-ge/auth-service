import { Test, TestingModule } from '@nestjs/testing';
import { RequestService } from './request.service';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestModule } from './request.module';

describe('RequestService', () => {
  let requestService: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RequestModule],
    }).compile();

    requestService = await module.resolve<RequestService>(RequestService);
  });

  it('should be defined', () => {
    expect(requestService).toBeDefined();
  });

  describe.each([
    [{}, false],
    [{ 'x-request-id': '' }, false],
    [{ 'x-request-id': '0' }, false],
    [{ 'x-request-id': 'a' }, false],
    [{ 'x-request-id': 'A' }, false],
    [{ 'x-request-id': 'AAA' }, false],
    [{ 'x-request-id': uuidv4() }, true],
    [{ 'x-request-id': 'c97efe5412c8bd8214ea4bc08ef0066' }, true],
    [{ 'x-request-id': 'sd7eb_fe5412c8bd821_4_ea4bcf0066' }, true],
    [{ 'x-request-id': 'c97eb-fe54-12c8bd-8214ea4bc08ef0066' }, true],
  ])('hasRequestId [%o]', (headers, expected) => {
    test(`should return ${expected}`, () => {
      const request = {
        get: (id) => request.headers[id],
        headers,
      } as unknown as Request;
      expect(RequestService.hasRequestId(request)).toBe(expected);
    });
  });

  describe('injectRequestId', () => {
    it('should inject request id', () => {
      const request = {
        headers: {},
      } as unknown as Request;
      RequestService.injectRequestId(request);
      expect(request.headers).toEqual({
        'x-request-id': expect.any(String),
      });
    });
  });

  describe('getRequestId', () => {
    it('should return request id', () => {
      const request = {
        get: () => request.headers['x-request-id'],
        headers: {
          'x-request-id': uuidv4(),
        },
      } as unknown as Request;
      const requestService = new RequestService(request);
      expect(requestService.getRequestId()).toEqual(request.headers['x-request-id']);
    });
  });
});
