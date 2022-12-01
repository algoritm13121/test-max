import User from '../model';

export default function saveUser (user) {
    return User.create(user);
}
