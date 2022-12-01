import Admin from '../model';

export default function getAnyAdmin () {
    return Admin.find({ id: 'admin_id' });
}
