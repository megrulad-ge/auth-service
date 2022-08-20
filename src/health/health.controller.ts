import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: 'Health check',
    schema: {
      type: 'object',
      example: {
        status: 'alive',
      },
      properties: {
        status: {
          type: 'string',
          example: 'alive',
        },
      },
    },
  })
  public getHealth() {
    return {
      status: 'alive',
    };
  }
}
