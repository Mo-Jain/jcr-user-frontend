'use client'

import {QRCodeSVG} from 'qrcode.react'

interface UpiQrCodeProps {
  upiId: string
  name: string
  amount: number
  className?: string
}

const UpiQrCode: React.FC<UpiQrCodeProps> = ({ upiId, name, amount, className }) => {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`

  return (
    <div className={`p-4 w-full rounded-xl bg-background ${className}`}>
      <QRCodeSVG
        value={upiUrl}
        bgColor="transparent"
        fgColor="currentColor"
        level="H"
        size={300}
        className="fill-foreground w-full"
      />
    </div>
  )
}

export default UpiQrCode
