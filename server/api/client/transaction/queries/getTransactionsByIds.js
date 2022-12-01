import Transaction from '../model';

export default function nullifyCategories (ids) {
    return Transaction.find({ id: { $in: ids } });
}
