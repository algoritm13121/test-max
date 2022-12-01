import Qiwi from '../model';

export default function saveToken (token) {
    return Qiwi.create(token);
}
