import User from '../model';

export default function getUserByEmail (email) {
    return User.findOne({ email });
}
