function validateConfirmPassword(password: string, confirmPassword: string) {
    return (password !== "") && (password === confirmPassword);
}
