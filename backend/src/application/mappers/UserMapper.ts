import { User } from "../../domain/entities/User.entity";
import { UserLean } from "../../infrastructure/database/models/User";

export const toDomainUser = (dbUser: UserLean): User => {
  return new User({
    id: dbUser._id.toString(),
    name: dbUser.name,
    email: dbUser.email,
    password: dbUser.password ?? undefined,
    refreshTokens: dbUser.refreshTokens ?? [],
  });
};

export const toPersistenceUser = (user: User) => {
  return {
    name: user.name,
    email: user.email,
    password: user.getPassword(),
    refreshTokens: user.getRefreshTokens(),
  };
};