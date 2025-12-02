export class ChangeUsernameDto {
    readonly user_id: number;
    readonly currentPassword: string;
    readonly newUsername: string;
}
