import { Min } from 'class-validator';
export class CreateUserPresenter {
  @Min(1)
  username = '';
  @Min(6)
  password = '';
}

export class UpdateUserPresenter {
  @Min(1)
  username = '';
  @Min(6)
  password = '';
}

export function presentItems(items: any[]) {
  return items.map((item) => {
    return presentItem(item);
  });
}

export function presentItem(item: any) {
  return {
    id: item.id,
    username: item.username,
    full_name: item.username,
  };
}

export class UpdateMatchingProfilePresenter {}

export class MatchingPresenter {}
