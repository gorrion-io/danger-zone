
import { registerEnumType, Field, InputType } from "type-graphql";

export enum ROLE {
    User = "USER",
    Admin = "ADMIN",
    Moderator = "MODERATOR",
}

registerEnumType(ROLE, {
    name: "Roles",
    description: "Roles linked with user",
});

@InputType()
class RoleInput {
    @Field(type => ROLE)
    role: ROLE;
}