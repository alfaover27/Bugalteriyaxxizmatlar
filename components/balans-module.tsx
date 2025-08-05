"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import { useAccounting } from "@/contexts/accounting-context"

export default function BalansModule() {
  const { kirimData, chiqimData, loading } = useAccounting()

  const calculations = useMemo(() => {
    // Calculate totals from Kirim data
    const kirimTotals = kirimData.reduce(
      (acc, item) => ({
        jamiQarzDorlik: acc.jamiQarzDorlik + item.jamiQarzDorlik,
        tolandiJami: acc.tolandiJami + item.tolandi.jami,
        qoldiq: acc.qoldiq + item.qoldiq,
      }),
      { jamiQarzDorlik: 0, tolandiJami: 0, qoldiq: 0 },
    )

    // Calculate totals from Chiqim data
    const chiqimTotals = chiqimData.reduce(
      (acc, item) => ({
        jamiHisoblangan: acc.jamiHisoblangan + item.jamiHisoblangan,
        tolangan: acc.tolangan + item.tolangan,
        qoldiqQarzDorlik: acc.qoldiqQarzDorlik + item.qoldiqQarzDorlik,
        qoldiqAvans: acc.qoldiqAvans + item.qoldiqAvans,
      }),
      { jamiHisoblangan: 0, tolangan: 0, qoldiqQarzDorlik: 0, qoldiqAvans: 0 },
    )

    // Calculate balance
    const netIncome = kirimTotals.tolandiJami - chiqimTotals.tolangan
    const totalReceivables = kirimTotals.qoldiq + chiqimTotals.qoldiqAvans
    const totalPayables = chiqimTotals.qoldiqQarzDorlik

    return {
      kirimTotals,
      chiqimTotals,
      netIncome,
      totalReceivables,
      totalPayables,
      netPosition: totalReceivables - totalPayables,
    }
  }, [kirimData, chiqimData])

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Ma'lumotlar yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Moliyaviy balans</h1>
        <p className="text-gray-600">Umumiy moliyaviy holat va balans hisoboti</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sof daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calculations.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatNumber(calculations.netIncome)}
            </div>
            <Badge variant={calculations.netIncome >= 0 ? "default" : "destructive"} className="mt-2">
              {calculations.netIncome >= 0 ? "Foyda" : "Zarar"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami debitorlik</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatNumber(calculations.totalReceivables)}</div>
            <p className="text-xs text-muted-foreground mt-2">Mijozlar qarzi + Avanslar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami kreditorlik</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatNumber(calculations.totalPayables)}</div>
            <p className="text-xs text-muted-foreground mt-2">To'lanmagan xarajatlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sof pozitsiya</CardTitle>
            <PieChart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calculations.netPosition >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatNumber(calculations.netPosition)}
            </div>
            <Badge variant={calculations.netPosition >= 0 ? "default" : "destructive"} className="mt-2">
              {calculations.netPosition >= 0 ? "Ijobiy" : "Salbiy"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets (Aktivlar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">Aktivlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Mijozlar qarzi</span>
              <span className="text-green-600 font-semibold">{formatNumber(calculations.kirimTotals.qoldiq)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Berilgan avanslar</span>
              <span className="text-green-600 font-semibold">
                {formatNumber(calculations.chiqimTotals.qoldiqAvans)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 border-green-200 bg-green-50 px-2 rounded">
              <span className="font-bold text-green-700">Jami aktivlar</span>
              <span className="text-green-700 font-bold text-lg">{formatNumber(calculations.totalReceivables)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities (Passivlar) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">Passivlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Kreditorlik qarzi</span>
              <span className="text-red-600 font-semibold">
                {formatNumber(calculations.chiqimTotals.qoldiqQarzDorlik)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Boshqa majburiyatlar</span>
              <span className="text-red-600 font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 border-red-200 bg-red-50 px-2 rounded">
              <span className="font-bold text-red-700">Jami passivlar</span>
              <span className="text-red-700 font-bold text-lg">{formatNumber(calculations.totalPayables)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Daromadlar va xarajatlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600 border-b pb-2">Daromadlar</h3>
                <div className="flex justify-between">
                  <span>Jami hisoblangan daromad</span>
                  <span className="font-semibold">{formatNumber(calculations.kirimTotals.jamiQarzDorlik)}</span>
                </div>
                <div className="flex justify-between">
                  <span>To'langan daromad</span>
                  <span className="font-semibold text-green-600">
                    {formatNumber(calculations.kirimTotals.tolandiJami)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 border-b pb-2">Xarajatlar</h3>
                <div className="flex justify-between">
                  <span>Jami hisoblangan xarajat</span>
                  <span className="font-semibold">{formatNumber(calculations.chiqimTotals.jamiHisoblangan)}</span>
                </div>
                <div className="flex justify-between">
                  <span>To'langan xarajat</span>
                  <span className="font-semibold text-red-600">{formatNumber(calculations.chiqimTotals.tolangan)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 pt-4 mt-6">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-lg font-bold">Sof natija (Naqd pul bo'yicha)</span>
                <span
                  className={`text-xl font-bold ${calculations.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatNumber(calculations.netIncome)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Asosiy ko'rsatkichlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {calculations.kirimTotals.jamiQarzDorlik > 0
                  ? Math.round((calculations.kirimTotals.tolandiJami / calculations.kirimTotals.jamiQarzDorlik) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600 mt-1">Daromad yig'ish darajasi</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {calculations.chiqimTotals.jamiHisoblangan > 0
                  ? Math.round((calculations.chiqimTotals.tolangan / calculations.chiqimTotals.jamiHisoblangan) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600 mt-1">Xarajat to'lash darajasi</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {calculations.kirimTotals.tolandiJami > 0
                  ? Math.round((calculations.netIncome / calculations.kirimTotals.tolandiJami) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600 mt-1">Foyda marjasi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
