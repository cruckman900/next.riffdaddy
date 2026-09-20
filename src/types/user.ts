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
    id: string
    username: string
    email: string
    created_at: string
}

// Shape returned by POST /users/login and POST /users/ (register) — a
// signed JWT access token alongside the user it belongs to.
export interface AuthResponse {
    access_token: string
    token_type: string
    user: UserRead
}
