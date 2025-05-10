import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * @param {Object} params
 * @param {string} params.email - Correo principal
 * @param {string} params.asistencia - Confirmación general
 * @param {Array}  params.personas - Lista de { name, message }
 */
export async function sendMail({ email, asistencia, personas }) {
  const fecha = new Date().toLocaleString('es-ES');

  const htmlPersonas = personas.map((p, index) => `
    <div style="margin-bottom: 1.5rem;">
      <h3>Persona ${index + 1}</h3>
      <p><strong>Nombre:</strong> ${p.name}</p>
      <p><strong>Alergias / mensaje:</strong> ${p.message}</p>
    </div>
  `).join('');

  const html = `
    <h2>Formulario recibido</h2>
    <p><strong>Fecha de envío:</strong> ${fecha}</p>
    <p><strong>Email de contacto:</strong> ${email}</p>
    <p><strong>¿Va a asistir?</strong> ${asistencia}</p>
    <hr>
    ${htmlPersonas}
  `;

  const result = await resend.emails.send({
    from: 'Formulario web <no-reply@santisanchez.dev>',
    to: 'sanzdecastro@gmail.com',
    subject: 'Confirmación de asistencia (web)',
    html,
    replyTo: email,
  });

  if (result.error) {
    console.error('Resend error:', result.error);
    throw new Error(result.error.message);
  }

  return result;
}
