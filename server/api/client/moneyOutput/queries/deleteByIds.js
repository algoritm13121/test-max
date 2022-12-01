import Output from '../model';

export default function deleteByIds (ids) {
    return Output.deleteMany({ id: { $in: ids } });
}
