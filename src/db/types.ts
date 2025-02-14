/* ----------------- User Schema ----------------- */
export const UserRoleType = {
    ADMIN: "ADMIN",
    HR: "HR",
    EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRoleType = (typeof UserRoleType)[keyof typeof UserRoleType];

export type users = {
    id_user:string;
    email: string;
    password: string;
    name: string;
    is_active: boolean;
    created_at: string;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
    disabled_at: string | null;
    disabled_by: string | null;
    role: UserRoleType;
}
