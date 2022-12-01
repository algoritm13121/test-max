import Qiwi from '../model';

export default function removeOldToken () {
    return Qiwi.deleteMany({});
}
