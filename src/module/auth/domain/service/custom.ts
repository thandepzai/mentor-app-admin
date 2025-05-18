import { ExtraDataService } from "./extraData";

export class CustomAuthService {
    static useAuthExtraData = () => {
        return ExtraDataService.useExtraData({
            role: true,
            permission: true
        });
    };
}
