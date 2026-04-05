import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
    },
})

export async function POST(request) {
    try {
        const { name, phone, message } = await request.json()

        if (!name || !phone || !message) {
            return Response.json(
                { error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            )
        }

        await transporter.sendMail({
            from: 'Vạn Sao Website <onboarding@resend.dev>',
            to: process.env.CONTACT_EMAIL,
            subject: `[Vạn Sao] Yêu cầu tư vấn từ ${name}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #7c3aed; margin-bottom: 24px;">Yêu cầu tư vấn mới từ website</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px; color: #374151;">Họ và tên</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #eee; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #eee; font-weight: bold; color: #374151;">Số điện thoại</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #eee;">
                <a href="tel:${phone}" style="color: #7c3aed; font-weight: bold;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; vertical-align: top;">Nội dung</td>
              <td style="padding: 12px 16px; color: #111827; line-height: 1.6;">${message}</td>
            </tr>
          </table>
          <div style="margin-top: 32px; padding: 16px; background: #f5f3ff; border-radius: 8px; border-left: 4px solid #7c3aed;">
            <p style="margin: 0; color: #6d28d9; font-size: 14px;">
              Hãy liên hệ lại sớm nhất có thể để không bỏ lỡ khách hàng tiềm năng!
            </p>
          </div>
          <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">
            Email này được gửi tự động từ website vansao.com
          </p>
        </div>
      `,
        })

        return Response.json({ success: true })
    } catch (error) {
        console.error('Email error details:', error.message)
        console.error('Full error:', error)
        return Response.json(
            { error: error.message || 'Gửi email thất bại. Vui lòng thử lại.' },
            { status: 500 }
        )
    }
}