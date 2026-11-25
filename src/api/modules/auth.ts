import { request } from '../request'
export interface CurrentUser { id: number; username: string; nickname: string }
export async function getCsrfToken() { return request.get('/auth/csrf') as Promise<{ token: string; headerName: string }> }
export async function login(username: string, password: string) { return request.post('/auth/login', { username, password }) as Promise<{ code:number; message:string; data:CurrentUser }> }
export async function getCurrentUser() { return request.get('/auth/me') as Promise<{ code:number; data:CurrentUser }> }
export async function logout() { return request.post('/auth/logout') }
