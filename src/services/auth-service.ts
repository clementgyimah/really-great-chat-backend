import bcrypt from 'bcrypt';

import userRepo from '@repos/user-repo';
import jwtUtil from '@util/jwt-util';
import { UnauthorizedError, UserAlreadyExist } from '@shared/errors';
import { TPromiseString, IUser, ILoginUser} from '@customTypes/index'

/**
 * New account service
 * 
 * @param props contains name, email and password
 * @returns signed token
 */
async function createAccount(props: IUser) {
    const user = await userRepo.getOne(props.email);
    if (user) {
        throw new UserAlreadyExist();
    }
    const pwdRounds = 9
    const pwdHash = await bcrypt.hash(props.password, pwdRounds);
    const newUser = {
    id: '',
    name: props.name,
    email: props.email,
    pwdHash: pwdHash,
    }
    const addUserRes = await userRepo.add(newUser);
    return jwtUtil.sign({
        id: addUserRes.id,
        email: addUserRes.email,
        name: addUserRes.name
    })
}

/**
 * Login service
 * 
 * @param props contains email and passwrd
 * @returns 
 */
async function login(props: ILoginUser): TPromiseString {
    // Fetch user
    const user = await userRepo.getOne(props.email);
    if (!user) {
        throw new UnauthorizedError();
    }
    // Check password
    const pwdPassed = await bcrypt.compare(props.password, user.pwdHash);
    if (!pwdPassed) {
        throw new UnauthorizedError();
    }
    // Setup Admin Cookie
    return jwtUtil.sign({
        id: user.id,
        email: user.name,
        name: user.name,
    });
}


// Export default
export default {
    login,
    createAccount
} as const;
