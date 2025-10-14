// types/user.ts
export interface UserCreate {
    username: string
    email: string
    password: string
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserRead {
    user_id: string
    username: string
    created_at: string
}
