// src/middleware.ts - ACTUALIZADO para backend real
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔐 Middleware ejecutándose para:', request.nextUrl.pathname)
  
  const requiresAuth = request.nextUrl.pathname.startsWith('/dashboard')
  
  if (requiresAuth) {
    console.log('🛡️ Ruta protegida detectada')
    
    const token = request.cookies.get('token')?.value
    console.log('🔍 Token en cookies:', token ? 'SÍ' : 'NO')
    
    if (!token) {
      console.log('🚫 No hay token, redirigiendo al login...')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // ✅ SIMPLIFICADO: Cualquier token válido del backend es aceptado
    // En una app real, aquí verificaríamos con el backend
    console.log('✅ Token del backend aceptado')
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}