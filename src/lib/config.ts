import "server-only"; 
  /** 
 * Backend-ийн хаяг. `server-only` импорт нь энэ файлыг Client Component-д  * санамсаргүй оруулбал build алдаа өгнө: хаяг, токен browser-т хүрэхгүй. 
 */ export const API_URL = process.env.API_URL ?? "http://localhost:8080"; 
  
/** Бүх endpoint-ийн угтвар */ 
export const API_BASE = `${API_URL}/api/v1`; 
