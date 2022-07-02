export default class UserDto{
    email;
    id;
    isActivated;
    constructor(model){
        this.email = model.email;
        this.id = model.user_id;
        this.isActivated = model.isactivated;
    }
}