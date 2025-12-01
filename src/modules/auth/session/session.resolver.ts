import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { GqlContext } from 'src/shared/types/gql-context.types';
import { UserModel } from '../account/models/user.model';
import { LogInInput } from './input/login.input';
import { SessionService } from './session.service';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) { }


  @Mutation(() => UserModel, { name: 'login' })
  public async login(@Context() { req }: GqlContext, @Args('data') input: LogInInput) {
    return this.sessionService.login(req, input);
  }

  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: GqlContext) {
    return this.sessionService.logout(req);

  }


}
