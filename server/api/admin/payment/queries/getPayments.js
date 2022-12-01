import Payment from '../model';

export default function getPayments () {
    return Payment.find({});
}
