import { registerEnumType } from 'type-graphql';

export enum GrantType {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}

registerEnumType(GrantType, {
  name: 'GrantType',
});
