import Transaction from '../model';

export default function saveTransaction (transaction) {
    return Transaction.create(transaction);
}
