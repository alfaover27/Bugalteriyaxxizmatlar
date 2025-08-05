"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
  type NotificationData as DBNotificationData,
} from "@/lib/database"

export interface NotificationData {
  id: number
  title: string
  message: string
  date?: string
  isRecurring: boolean
  frequency?: string
  isActive: boolean
  createdAt: string
}

interface NotificationContextType {
  notifications: NotificationData[]
  loading: boolean
  addNotificationItem: (data: Omit<NotificationData, "id" | "createdAt">) => Promise<void>
  updateNotificationItem: (id: number, data: Partial<NotificationData>) => Promise<void>
  deleteNotificationItem: (id: number) => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Transform functions
function transformNotificationFromDB(dbData: DBNotificationData): NotificationData {
  return {
    id: dbData.id!,
    title: dbData.title,
    message: dbData.message,
    date: dbData.date || undefined,
    isRecurring: dbData.is_recurring,
    frequency: dbData.frequency || undefined,
    isActive: dbData.is_active,
    createdAt: dbData.created_at!,
  }
}

function transformNotificationToDB(
  data: Omit<NotificationData, "id" | "createdAt">,
): Omit<DBNotificationData, "id" | "created_at"> {
  return {
    title: data.title,
    message: data.message,
    date: data.date,
    is_recurring: data.isRecurring,
    frequency: data.frequency,
    is_active: data.isActive,
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)

  const refreshNotifications = async () => {
    try {
      setLoading(true)
      const result = await getNotifications()
      setNotifications(result.map(transformNotificationFromDB))
    } catch (error) {
      console.error("Error refreshing notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshNotifications()
  }, [])

  const addNotificationItem = async (data: Omit<NotificationData, "id" | "createdAt">) => {
    try {
      const dbData = transformNotificationToDB(data)
      const result = await addNotification(dbData)
      const newNotification = transformNotificationFromDB(result)
      setNotifications((prev) => [newNotification, ...prev])
    } catch (error) {
      console.error("Error adding notification:", error)
      throw error
    }
  }

  const updateNotificationItem = async (id: number, data: Partial<NotificationData>) => {
    try {
      const dbData: Partial<DBNotificationData> = {}

      if (data.title !== undefined) dbData.title = data.title
      if (data.message !== undefined) dbData.message = data.message
      if (data.date !== undefined) dbData.date = data.date
      if (data.isRecurring !== undefined) dbData.is_recurring = data.isRecurring
      if (data.frequency !== undefined) dbData.frequency = data.frequency
      if (data.isActive !== undefined) dbData.is_active = data.isActive

      const result = await updateNotification(id, dbData)
      const updatedNotification = transformNotificationFromDB(result)
      setNotifications((prev) => prev.map((item) => (item.id === id ? updatedNotification : item)))
    } catch (error) {
      console.error("Error updating notification:", error)
      throw error
    }
  }

  const deleteNotificationItem = async (id: number) => {
    try {
      await deleteNotification(id)
      setNotifications((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  const value: NotificationContextType = {
    notifications,
    loading,
    addNotificationItem,
    updateNotificationItem,
    deleteNotificationItem,
    refreshNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
