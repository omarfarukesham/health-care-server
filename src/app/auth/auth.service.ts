const loginUser = async (payload:{
    email: string;
    password: string;
}): Promise<void> => {
    const { email, password } = payload;
    console.log(payload)
}
export const AuthService = {
    loginUser,
}