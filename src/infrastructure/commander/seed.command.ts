import { Command, CommandRunner } from 'nest-commander';
import { User } from '@domain/schemas/user.schema';
import { DataSource, In } from 'typeorm';
import { JwtTokenService } from '../services/jwt.service';
import { Role } from '@domain/schemas/role.schema';
import { RolePerm } from '@domain/schemas/roles_perms.schema';
import { UserRole } from '@domain/schemas/roles_users.schema';
import { Perm } from '@domain/schemas/perm.schema';
import { PASSWORD_DEFAULT, ROLE } from '@domain/util/const.variable';
import * as glob from 'glob';
import { join } from 'path';

@Command({ name: 'seed' })
export class SeedCommand extends CommandRunner {
  constructor(
    private readonly jwtService: JwtTokenService,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async run() {
    await this.dataSource.transaction(async (manager) => {
      await this.createPerm(manager);
      await this.createRole(manager);
      await this.createRolePerm(manager);
      await this.createUser(manager);
      await this.createUserRole(manager);
    });
  }

  private loadRoutes(pattern: string) {
    const routes = [];
    const files = glob.sync(pattern);
    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeModules = require(join(process.cwd(), file));
      Object.values(routeModules).forEach((routeArray: any) => {
        routeArray.forEach((route) => {
          routes.push(route);
        });
      });
    }
    return routes;
  }

  private async createPerm(manager) {
    const pattern = join('dist/presentation/routes/*.route.js');
    const routers = this.loadRoutes(pattern);
    const permRepo = manager.getRepository(Perm);
    const newPerms = [];
    for (const route of routers) {
      const { access_type, module, action, method } = route;
      const existingPerm = await permRepo.findOne({
        where: {
          access_type,
          module,
          action,
          method,
        },
      });
      if (!existingPerm) {
        const newPerm = permRepo.create(route);
        newPerms.push(newPerm);
        console.log(`Inserted permission for ${module} ${action} ${method}`);
      } else {
        console.log(
          `Permission for ${module} ${action} ${method} already exists, skipping...`,
        );
      }
    }
    await permRepo.save(newPerms);
  }

  private async createRole(manager) {
    const roleRepo = manager.getRepository(Role);
    const roles = await roleRepo.find({
      where: {
        id: In([1, 2]),
      },
    });

    if (roles.length < 2) {
      await roleRepo.save([
        {
          id: 1,
          title: 'Admin',
          access_type: 1,
          description: '',
        },
        {
          id: 2,
          title: 'Staff',
          access_type: 2,
          description: '',
        },
      ]);
      console.log('Inserted roles');
    } else {
      console.log('Roles already exists, skipping...');
    }
  }

  private async createRolePerm(manager) {
    const permRepo = manager.getRepository(Perm);
    const perms = await permRepo.find();
    const rolesPerms: RolePerm[] = [];

    perms.forEach((perm: any) => {
      if (perm.access_type == ROLE.ADMIN) {
        const rolePerm = {
          role_id: 1,
          perm_id: perm.id,
        };
        rolesPerms.push(rolePerm);
      } else if (perm.access_type == ROLE.STAFF) {
        const rolePerm = {
          role_id: 2,
          perm_id: perm.id,
        };
        rolesPerms.push(rolePerm);
      } else if (perm.access_type == '1,2' || perm.access_type == ROLE.PUBLIC) {
        const rolePerm = {
          role_id: 1,
          perm_id: perm.id,
        };
        rolesPerms.push(rolePerm);
        const rolePerm2 = {
          role_id: 2,
          perm_id: perm.id,
        };
        rolesPerms.push(rolePerm2);
      }
    });
    const values = [];
    const rolePermRepo = manager.getRepository(RolePerm);
    for (const rolePerm of rolesPerms) {
      const existingRolePerm = await rolePermRepo.findOne({
        where: {
          role_id: rolePerm.role_id,
          perm_id: rolePerm.perm_id,
        },
      });
      if (!existingRolePerm) {
        const rp = {
          role_id: rolePerm.role_id,
          perm_id: rolePerm.perm_id,
        };
        values.push(rp);
        console.log(
          `Inserted RolePerm for ${rolePerm.role_id} ${rolePerm.perm_id}`,
        );
      } else {
        console.log(
          `RolePerm for ${rolePerm.role_id} ${rolePerm.perm_id} already exists, skipping...`,
        );
      }
    }
    await rolePermRepo.save(values);
  }

  private async createUser(manager) {
    const admin = 1;
    const staff = 2;
    const userRepo = manager.getRepository(User);
    const users = await userRepo.find({
      where: {
        id: In([1, 2]),
      },
    });

    if (users.length < 2) {
      const passDefault = await this.jwtService.hashAsync(PASSWORD_DEFAULT);
      await userRepo.save([
        {
          id: 1,
          username: 'admin',
          full_name: 'Admin',
          role_ids: admin,
          password: passDefault,
        },

        {
          id: 2,
          username: 'staff',
          full_name: 'Staff',
          role_ids: staff,
          password: passDefault,
        },
      ]);
      console.log('Inserted users');
    } else {
      console.log('User already exists, skipping...');
    }
  }

  private async createUserRole(manager) {
    const userroleRepo = manager.getRepository(UserRole);

    const userRoles = [
      {
        role_id: 1,
        user_id: 1,
      },
      {
        role_id: 2,
        user_id: 2,
      },
    ];

    for (const userRole of userRoles) {
      const { role_id, user_id } = userRole;
      const existingUserRole = await userroleRepo.findOne({
        where: {
          role_id,
          user_id,
        },
      });

      if (!existingUserRole) {
        await userroleRepo.save(userRole);
        console.log(`Inserted role_id: ${role_id}, user_id: ${user_id}`);
      } else {
        console.log(`Role_id: ${role_id}, user_id: ${user_id} already exists`);
      }
    }
  }
}
