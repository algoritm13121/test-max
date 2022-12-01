export const getOptions = (info, defaultSort = { _id: -1 }) => {
    let sort = defaultSort;
    if (info.filters && info.filters.sortBy) {
        sort = {};
        sort[info.filters.sortBy] = info.filters.sortDesc ? -1 : 1;
    }
    let options = { sort };

    if (info.page && info.perPage) {
        const offset = (info.page - 1) * info.perPage;
        const limit = +info.perPage;

        options = {
            skip: offset,
            limit,
            sort
        };
    }

    return options;
};
