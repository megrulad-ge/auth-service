import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '/src/users/users.controller';
import { UserClaims } from '/src/users/user.type';

describe('UsersService', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get(UsersController);
  });

  describe('getProfile', () => {
    it('should get decoded user claims', () => {
      const payload: UserClaims = {
        roles: ['Admin'],
        iat: 1623777600,
        exp: 1623781200,
        uuid: 'uuid',
      };

      const result = controller.getProfile(payload);

      expect(result).toBeDefined();
    });
  });
});
