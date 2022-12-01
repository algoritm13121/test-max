import User from '../model';

export default function getUsersCount () {
    return User.count({});
}
