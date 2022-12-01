import User from '../model';

export default function deleteByIds (ids) {
    return User.deleteMany({ id: { $in: ids } });
}
