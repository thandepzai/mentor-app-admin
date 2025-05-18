import { numberWithCommas } from "lib/util/number";

export const formatPrice = (price: number) => {
    return numberWithCommas(price) + "đ";
};
