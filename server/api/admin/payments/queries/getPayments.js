import Payments from '../../../client/payments/model';

export default function updatePayments () {
    return Payments.find({});
}
