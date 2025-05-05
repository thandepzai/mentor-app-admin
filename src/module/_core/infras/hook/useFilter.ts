import { useState } from "react";

const useFilter = <FilterDto>() => {
    const [filter, setFilter] = useState<FilterDto>({} as FilterDto);

    return {
        filter,
        changeFilter: setFilter
    };
};

export default useFilter;
