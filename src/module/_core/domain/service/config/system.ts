import { useGlobalState } from "@lib/hook/useGlobalState";
import { Int } from "@lib/util/number";

export enum SystemDataEnum {
    MAP_STUDY = 1,
    MAP_UNI = 2
}

export class SystemService {
    static SYSTEM_KEY = ["SYSTEM"];
    static getSystemData = () => {
        const systemValue = Int(localStorage.getItem("SYSTEM"));
        if (!systemValue || systemValue > 2 || systemValue < 1) return 1;
        return systemValue;
    };

    static useSystem = () => {
        const { data, mutate } = useGlobalState(this.SYSTEM_KEY, {
            initialData: this.getSystemData(),
            notifyOnChangeProps: ["data"]
        });
        const setSystemData = (value: SystemDataEnum) => {
            mutate(value);
            localStorage.setItem("SYSTEM", String(value));
        };

        return {
            data,
            setSystemData
        };
    };
}
