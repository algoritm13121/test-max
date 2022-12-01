import User from '../model';

export default function getAllUsers () {
    return User.find({});
}
