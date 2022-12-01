export default function getTransaction (body) {
    const { id, userId, dirName, amount, content } = body;

    return { id, userId, dirName, amount, content };
}
