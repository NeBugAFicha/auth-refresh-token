"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.id = model.user_id;
        this.isActivated = model.isactivated;
    }
}
exports.default = UserDto;
