export default function getUser (body) {
    const {
        positionIndex,
        hidden,
        id,
        name,
        surname,
        accountNumber,
        email,
        phone,
        accountStatus,
        country,
        city,
        address,
        password,
        docs,
        isActive,
        isVipStatus,
        blocked
    } = body;

    return {
        hidden,
        positionIndex,
        id,
        name,
        surname,
        accountNumber,
        email,
        phone,
        accountStatus,
        country,
        city,
        address,
        password,
        docs,
        isActive,
        isVipStatus,
        blocked
    };
}
