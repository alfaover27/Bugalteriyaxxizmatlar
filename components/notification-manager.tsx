"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Plus, Edit, Trash2, Calendar, Repeat } from "lucide-react"
import { useNotifications, type NotificationData } from "@/contexts/notification-context"

export default function NotificationManager() {
  const { notifications, loading, addNotificationItem, updateNotificationItem, deleteNotificationItem } =
    useNotifications()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NotificationData | null>(null)
  const [newNotification, setNewNotification] = useState<Partial<NotificationData>>({
    isRecurring: false,
    isActive: true,
  })

  const handleAddNotification = async () => {
    if (newNotification.title && newNotification.message) {
      try {
        await addNotificationItem({
          title: newNotification.title,
          message: newNotification.message,
          date: newNotification.date,
          isRecurring: newNotification.isRecurring || false,
          frequency: newNotification.frequency,
          isActive: newNotification.isActive || true,
        })
        setNewNotification({ isRecurring: false, isActive: true })
        setIsAddModalOpen(false)
      } catch (error) {
        console.error("Error adding notification:", error)
        alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
      }
    }
  }

  const handleUpdateNotification = async (updatedItem: NotificationData) => {
    try {
      await updateNotificationItem(updatedItem.id, updatedItem)
      setEditingItem(null)
    } catch (error) {
      console.error("Error updating notification:", error)
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    }
  }

  const handleDeleteNotification = async (id: number) => {
    if (confirm("Haqiqatan ham bu bildirishnomani o'chirmoqchimisiz?")) {
      try {
        await deleteNotificationItem(id)
      } catch (error) {
        console.error("Error deleting notification:", error)
        alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
      }
    }
  }

  const toggleNotificationStatus = async (notification: NotificationData) => {
    try {
      await updateNotificationItem(notification.id, {
        ...notification,
        isActive: !notification.isActive,
      })
    } catch (error) {
      console.error("Error toggling notification status:", error)
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Bildirishnomalar yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Bildirishnomalar</h1>
          <p className="text-gray-600">Eslatmalar va bildirishnomalarni boshqaring</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yangi bildirishnoma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yangi bildirishnoma qo'shish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Sarlavha</Label>
                <Input
                  id="title"
                  value={newNotification.title || ""}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Bildirishnoma sarlavhasi"
                />
              </div>
              <div>
                <Label htmlFor="message">Xabar</Label>
                <Textarea
                  id="message"
                  value={newNotification.message || ""}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Bildirishnoma matni"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="date">Sana (ixtiyoriy)</Label>
                <Input
                  id="date"
                  type="date"
                  value={newNotification.date || ""}
                  onChange={(e) => setNewNotification({ ...newNotification, date: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={newNotification.isRecurring || false}
                  onCheckedChange={(checked) => setNewNotification({ ...newNotification, isRecurring: checked })}
                />
                <Label htmlFor="recurring">Takrorlanuvchi</Label>
              </div>
              {newNotification.isRecurring && (
                <div>
                  <Label htmlFor="frequency">Takrorlash chastotasi</Label>
                  <Select
                    value={newNotification.frequency || ""}
                    onValueChange={(value) => setNewNotification({ ...newNotification, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chastotani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Har kuni</SelectItem>
                      <SelectItem value="weekly">Har hafta</SelectItem>
                      <SelectItem value="monthly">Har oy</SelectItem>
                      <SelectItem value="yearly">Har yil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newNotification.isActive || true}
                  onCheckedChange={(checked) => setNewNotification({ ...newNotification, isActive: checked })}
                />
                <Label htmlFor="active">Faol</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleAddNotification} className="bg-gray-900 hover:bg-gray-800 text-white">
                Saqlash
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirishnomalar yo'q</h3>
              <p className="text-gray-500 text-center mb-4">
                Hozircha hech qanday bildirishnoma yo'q. Yangi bildirishnoma qo'shish uchun yuqoridagi tugmani bosing.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.isActive ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={notification.isActive ? "default" : "secondary"}>
                        {notification.isActive ? "Faol" : "Nofaol"}
                      </Badge>
                      {notification.isRecurring && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {notification.frequency === "daily" && "Har kuni"}
                          {notification.frequency === "weekly" && "Har hafta"}
                          {notification.frequency === "monthly" && "Har oy"}
                          {notification.frequency === "yearly" && "Har yil"}
                        </Badge>
                      )}
                      {notification.date && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(notification.date).toLocaleDateString("uz-UZ")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={notification.isActive}
                      onCheckedChange={() => toggleNotificationStatus(notification)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingItem(notification)}
                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{notification.message}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Yaratilgan: {new Date(notification.createdAt).toLocaleDateString("uz-UZ")}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bildirishnomani tahrirlash</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Sarlavha</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-message">Xabar</Label>
                <Textarea
                  id="edit-message"
                  value={editingItem.message}
                  onChange={(e) => setEditingItem({ ...editingItem, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Sana (ixtiyoriy)</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingItem.date || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-recurring"
                  checked={editingItem.isRecurring}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isRecurring: checked })}
                />
                <Label htmlFor="edit-recurring">Takrorlanuvchi</Label>
              </div>
              {editingItem.isRecurring && (
                <div>
                  <Label htmlFor="edit-frequency">Takrorlash chastotasi</Label>
                  <Select
                    value={editingItem.frequency || ""}
                    onValueChange={(value) => setEditingItem({ ...editingItem, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chastotani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Har kuni</SelectItem>
                      <SelectItem value="weekly">Har hafta</SelectItem>
                      <SelectItem value="monthly">Har oy</SelectItem>
                      <SelectItem value="yearly">Har yil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingItem.isActive}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isActive: checked })}
                />
                <Label htmlFor="edit-active">Faol</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Bekor qilish
              </Button>
              <Button
                onClick={() => handleUpdateNotification(editingItem)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Saqlash
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
