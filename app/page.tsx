"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, TrendingUp, TrendingDown, BarChart3, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import { AccountingProvider } from "@/contexts/accounting-context"
import { NotificationProvider } from "@/contexts/notification-context"
import KirimModule from "@/components/kirim-module"
import ChiqimModule from "@/components/chiqim-module"
import BalansModule from "@/components/balans-module"
import NotificationManager from "@/components/notification-manager"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("kirim")
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return (
    <AuthGuard>
      <AccountingProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900">Uzbek Accounting</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Xush kelibsiz!</span>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <LogOut className="h-4 w-4" />
                      Chiqish
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="kirim" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Kirim
                  </TabsTrigger>
                  <TabsTrigger value="chiqim" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Chiqim
                  </TabsTrigger>
                  <TabsTrigger value="balans" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Balans
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Bildirishnomalar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="kirim">
                  <KirimModule />
                </TabsContent>

                <TabsContent value="chiqim">
                  <ChiqimModule />
                </TabsContent>

                <TabsContent value="balans">
                  <BalansModule />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationManager />
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </NotificationProvider>
      </AccountingProvider>
    </AuthGuard>
  )
}
