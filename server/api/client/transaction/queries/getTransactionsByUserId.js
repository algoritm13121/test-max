import Transactions from '../model';

export default function getTransactionsByUserId (userId) {
    return Transactions.find({ userId });
}
