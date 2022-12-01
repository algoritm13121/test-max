import Payments from '../../../client/payments/model';

export default function getPayments (data) {
    return Payments.updateOne({ ...data });
}
