import User from '../model';

export default function editUser (user) {
    return User.findOneAndUpdate({ id: user.id }, user, { new: true });
}
