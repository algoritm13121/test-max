import User from '../model';

export default function getUserById (id) {
    return User.findOne({ id });
}
