import { ref } from "vue";
import {UserType} from "../models/user";

const currentUser = ref<UserType>();

const setCurrentUserState = (user: UserType) => {
    currentUser.value = user;
}

const getCurrentUserState = () : UserType | undefined => {
    return currentUser.value;
}

export {
    setCurrentUserState,
    getCurrentUserState,
}