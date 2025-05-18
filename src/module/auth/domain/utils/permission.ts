import { DEFAULT_ACTION_LIST } from "../constant/permission";

// sort by default actions, then alphabetically
// ["read", "create", "update", "delete", "a", "b", ...]
export const sortActions = <T extends { action: string }>(actions: T[]) => {
    const order = DEFAULT_ACTION_LIST;

    return actions.sort((a, b) => {
        if (order.indexOf(a.action) == -1 && order.indexOf(b.action) == -1) {
            if (a.action < b.action) {
                return -1;
            }
            if (a.action > b.action) {
                return 1;
            }
            return 0;
        } else {
            const compare = order.indexOf(a.action) - order.indexOf(b.action);
            return order.indexOf(a.action) != -1 && order.indexOf(b.action) != -1 ? compare : -compare;
        }
    });
};
