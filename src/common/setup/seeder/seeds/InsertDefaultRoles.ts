import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed } from '../entity/seeder.entity';
import { Seeds } from '../abstract/seeds.service';
import { Role } from '/src/roles/entities/role.entity';

@Injectable()
export class InsertDefaultRoles extends Seeds {
  constructor(
    @InjectRepository(Seed) protected readonly seedRepository: Repository<Seed>,
    @InjectRepository(Role) protected readonly roleRepository: Repository<Role>,
  ) {
    super(seedRepository);
  }

  get name() {
    return 'Insert default roles';
  }

  private get defaultRoles() {
    return [
      {
        name: 'Admin',
        description:
          'This is a high-level role that typically has access to all areas of the system and the ability to perform any action.',
      },
      {
        name: 'User',
        description:
          'This is a general role that is assigned to most users of the system. Users typically have limited permissions and can only perform certain actions.',
      },
      {
        name: 'Moderator',
        description:
          'This is a role that is responsible for managing and enforcing the rules of the system. Moderators may have the ability to delete or edit content, ban users, and perform other tasks to maintain order.',
      },
      {
        name: 'Customer',
        description:
          'This is a role that is assigned to customers of a business or service. Customers typically have access to certain areas of the system, such as their account or order history.',
      },
      {
        name: 'Guest',
        description:
          'This is a role that is assigned to users who are not logged in or do not have a full account. Guests typically have limited permissions and cannot perform certain actions.',
      },
      {
        name: 'Superuser',
        description:
          'This is a role that has access to all areas of the system and the ability to perform any action. The superuser role is often reserved for the system administrator or other highly trusted users.',
      },
      {
        name: 'Editor',
        description:
          "This is a role that is responsible for managing and creating content within the system. Editors may have the ability to create, edit, and publish content, as well as manage other users' permissions.",
      },
      {
        name: 'Reviewer',
        description:
          'This is a role that is responsible for reviewing and approving content within the system. Reviewers may have the ability to view, edit, and approve content before it is published.',
      },
      {
        name: 'Script',
        description: 'This is a role that is responsible for action that Script can make.',
      },
    ];
  }

  async run() {
    await this.roleRepository.insert(this.defaultRoles);
  }
}
