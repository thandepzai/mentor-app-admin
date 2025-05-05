import { EntityState } from "module/_core/infras/config/type/entityState";

export const getStatus = (activeCondition: boolean) => (activeCondition ? EntityState.ACTIVE : EntityState.INACTIVE);

export const isActive = (status: EntityState) =>
    status === EntityState.ACTIVE ? true : status === EntityState.INACTIVE ? false : undefined;
