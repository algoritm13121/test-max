import Transaction from '../model';

export default function getTransactionById (id) {
    return Transaction.find({ id });
}
