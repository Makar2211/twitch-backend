import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Authorization } from 'src/shared/decorators/auth-decorator';
import { Authorized } from 'src/shared/decorators/authorizated-decorator';
import { AccountService } from './account.service';
import { CreateUserInput } from './input/create.user.input';
import { UserModel } from './models/user.model';

@Resolver('account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) { }


  @Authorization()
  @Query(() => UserModel, { name: 'findProfile' })
  public async me(@Authorized('id') id: number) {
    return this.accountService.me(id);
  }


  @Mutation(() => Boolean, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input);
  }
}


