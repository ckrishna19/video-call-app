const baseUrl = "http://localhost:4002/v1";

const userBaseUrl = `${baseUrl}/user`;
const messageBaseUrl = `${baseUrl}/message`;
export const loginUrl = `${userBaseUrl}/login`;
export const registerApi = `${userBaseUrl}/register`;
export const userListApi = `${userBaseUrl}`;
export const getUserProfileApi = `${userBaseUrl}`;
export const logOutUserApi = `${userBaseUrl}/logout`;
export const sendOtpApi = `${userBaseUrl}/send-otp`;
export const verifyOtpApi = `${userBaseUrl}/verify-otp`;
export const resetPasswordApi = `${userBaseUrl}/reset-password`;

// messages api
export const newMessageApi = `${messageBaseUrl}/new`;
export const getAllMessageApi = `${messageBaseUrl}/all`;
