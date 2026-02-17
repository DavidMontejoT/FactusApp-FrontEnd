import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userStr = localStorage.getItem('user')
      const token = localStorage.getItem('accessToken')

      if (userStr && token) {
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userData, accessToken, refreshToken) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
