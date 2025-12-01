import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AccountModule } from 'src/modules/auth/account/account.module';
import { SessionModule } from 'src/modules/auth/session/session.module';
import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';
import { getGraphqlConfig } from './config/graphql.config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    ignoreEnvFile: !IS_DEV_ENV,
  }),
  GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [ConfigModule],
    useFactory: getGraphqlConfig,
    inject: [ConfigService]
  }),
    PrismaModule,
    RedisModule,
    AccountModule,
    SessionModule
  ],
})
export class CoreModule { }
