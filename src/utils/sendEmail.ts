export const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://omcsollvnossmabsrwms.supabase.co/functions/v1/resend-email", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, subject, html })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || "Error al enviar correo")
  }

  return data
}


