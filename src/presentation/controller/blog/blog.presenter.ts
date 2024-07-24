import { Min } from 'class-validator';
export class CreateBlogPresenter {
  @Min(1)
  title = '';
  @Min(6)
  description = '';
}

export class UpdateBlogPresenter {
  @Min(1)
  title = '';
  @Min(6)
  description = '';
}
