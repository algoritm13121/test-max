import Payments from '../model';

export default function getPayments () {
    return Payments.find({});
}
