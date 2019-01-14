export interface IProfileOAuth {
    emails: Array<{ value: string; }>;
    provider: string;
    id: string;
    name: {
        familyName: string;
        givenName: string;
    };

}
