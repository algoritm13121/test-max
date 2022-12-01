import Transaction from '../model';

export default function deleteByIds (ids) {
    return Transaction.deleteMany({ id: { $in: ids } });
}
