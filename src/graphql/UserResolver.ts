/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return 'hi!';
    }
}
