export default function getOrder (body) {
    const {
        id,
        userId,
        dirName,
        assetName,
        createdAt,
        openingPrice,
        amount,
        pledge,
        closedAt,
        closedPrice,
        type,
        isClosed
    } = body;

    return {
        id,
        userId,
        dirName,
        assetName,
        createdAt,
        openingPrice,
        amount,
        pledge,
        closedAt,
        closedPrice,
        type,
        isClosed
    };
}
