import Transaction from '../model';

export default function getAllTransactions () {
    return Transaction.find({});
}
