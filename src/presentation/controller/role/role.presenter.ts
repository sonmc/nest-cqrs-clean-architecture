import { Min } from 'class-validator';
export class CreateRolePresenter {
  @Min(1)
  title = '';
  @Min(6)
  description = '';
}

export class UpdateRolePresenter {
  @Min(1)
  title = '';
  @Min(6)
  description = '';
}
