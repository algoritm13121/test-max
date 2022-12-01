import Output from '../model';

export default function editMoneyOutput (output) {
    return Output.findOneAndUpdate({ id: output.id }, output, { new: true });
}
