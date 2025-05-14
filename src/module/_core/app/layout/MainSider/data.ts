export interface IMenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    url?: string;
    children?: IMenuItem[];
}
