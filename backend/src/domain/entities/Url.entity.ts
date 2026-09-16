export class Url {
    public readonly id?: string;

    public userId: string;
    public originalUrl: string;
    public shortCode: string;

    constructor(props: UrlProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.originalUrl = props.originalUrl;
        this.shortCode = props.shortCode;
    }

    getId(): string {
        if (!this.id) {
            throw new Error("URL ID is not set");
        }

        return this.id;
    }

    updateOriginalUrl(originalUrl: string): void {
        this.originalUrl = originalUrl.trim();
    }
}

type UrlProps = {
    id?: string;
    userId: string;
    originalUrl: string;
    shortCode: string;
};