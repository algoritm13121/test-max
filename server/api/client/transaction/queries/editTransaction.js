import Transaction from '../model';

export default function editTransaction (transaction) {
    return Transaction.findOneAndUpdate({ id: transaction.id }, transaction, { new: true });
}
