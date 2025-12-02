export class ChangePasswordDto {
    readonly user_id: number;
    readonly currentPassword: string;
    readonly newPassword: string;
}
