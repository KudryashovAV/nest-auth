import {
  Controller,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResponse } from "./responses";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":identity")
  async fetchUser(@Param("identity") idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @Delete(":id")
  delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
