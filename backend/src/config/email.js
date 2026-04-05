import nodemailer from 'nodemailer';

// ─── Transporter ────────────────────────────────────────────────────────────
const createTransporter = () => {
    // Gmail SMTP (em produção usa App Password)
    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Gmail via serviço (fallback simples)
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Gmail App Password
        }
    });
};

const isEmailConfigured = () => !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// ─── Estilos base do email ───────────────────────────────────────────────────
const baseStyle = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0d1117;
  margin: 0; padding: 0;
`;
const containerStyle = `
  max-width: 580px; margin: 0 auto; padding: 40px 20px;
`;
const cardStyle = `
  background: #161b22; border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
`;
const headerStyle = `
  background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
  padding: 32px 32px 24px; text-align: center;
`;
const bodyStyle = `
  padding: 32px;
`;
const btnStyle = `
  display: inline-block; padding: 14px 32px; border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #ffffff; text-decoration: none; font-weight: 600;
  font-size: 15px; letter-spacing: 0.3px;
`;
const footerStyle = `
  text-align: center; padding: 24px 32px;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

// ─── Templates HTML ──────────────────────────────────────────────────────────

function htmlWrapper(content) {
    return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <div style="${containerStyle}">
    <div style="${cardStyle}">
      ${content}
      <div style="${footerStyle}">
        <p style="color:#6b7280; font-size:12px; margin:0;">
          🇲🇿 MUV Educação e Engenharia · Moçambique<br>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color:#3b82f6; text-decoration:none;">muvacademy.co.mz</a>
        </p>
      </div>
    </div>
  </div>
</body></html>`;
}

// ─── Email: Boas-vindas ──────────────────────────────────────────────────────
function welcomeTemplate(name) {
    return htmlWrapper(`
    <div style="${headerStyle}">
      <p style="font-size:40px; margin:0 0 8px;">🎓</p>
      <h1 style="color:#fff; font-size:24px; font-weight:700; margin:0;">Bem-vindo à MUV Academy!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#e2e8f0; font-size:16px; margin:0 0 16px;">Olá, <strong>${name}</strong>! 👋</p>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 24px;">
        A sua conta foi criada com sucesso. Explore os nossos cursos técnicos em Engenharia, 
        AutoCAD, GIS, SAP e muito mais — desenhados para impulsionar a sua carreira em Moçambique.
      </p>
      <div style="background:rgba(37,99,235,0.1); border-radius:10px; padding:20px; margin-bottom:24px; border:1px solid rgba(37,99,235,0.2);">
        <p style="color:#93c5fd; font-size:13px; margin:0; font-weight:600;">O que pode fazer agora:</p>
        <ul style="color:#94a3b8; font-size:13px; margin:12px 0 0; padding-left:20px; line-height:2;">
          <li>Explorar o catálogo de cursos</li>
          <li>Chose o seu primeiro curso</li>
          <li>Submeter o comprovativo de pagamento</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" style="${btnStyle}">
          🚀 Explorar Cursos
        </a>
      </div>
    </div>
  `);
}

// ─── Email: Inscrição recebida ───────────────────────────────────────────────
function enrollmentPendingTemplate(name, courseTitle) {
    return htmlWrapper(`
    <div style="${headerStyle}">
      <p style="font-size:40px; margin:0 0 8px;">📋</p>
      <h1 style="color:#fff; font-size:22px; font-weight:700; margin:0;">Inscrição Recebida!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#e2e8f0; font-size:16px; margin:0 0 16px;">Olá, <strong>${name}</strong>!</p>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 20px;">
        Recebemos a sua inscrição para o curso:
      </p>
      <div style="background:rgba(124,58,237,0.1); border-radius:10px; padding:20px; margin-bottom:24px; border:1px solid rgba(124,58,237,0.2);">
        <p style="color:#c4b5fd; font-size:15px; font-weight:700; margin:0;">📚 ${courseTitle}</p>
      </div>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 24px;">
        O nosso equipa irá verificar o seu comprovativo de pagamento em breve. 
        Normalmente o processo demora até <strong style="color:#e2e8f0;">24 horas úteis</strong>.
        Receberá um email quando a sua inscrição for aprovada.
      </p>
      <div style="text-align:center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="${btnStyle}">
          Ver Estado da Inscrição
        </a>
      </div>
    </div>
  `);
}

// ─── Email: Inscrição aprovada ───────────────────────────────────────────────
function enrollmentApprovedTemplate(name, courseTitle, courseId) {
    const courseUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses/${courseId}`;
    return htmlWrapper(`
    <div style="background:linear-gradient(135deg, #065f46 0%, #1e40af 100%); padding:32px; text-align:center;">
      <p style="font-size:48px; margin:0 0 8px;">🎉</p>
      <h1 style="color:#fff; font-size:22px; font-weight:700; margin:0;">Inscrição Aprovada!</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#e2e8f0; font-size:16px; margin:0 0 16px;">Parabéns, <strong>${name}</strong>!</p>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 20px;">
        A sua inscrição foi <strong style="color:#34d399;">aprovada</strong>. Já tem acesso completo ao curso:
      </p>
      <div style="background:rgba(52,211,153,0.1); border-radius:10px; padding:20px; margin-bottom:24px; border:1px solid rgba(52,211,153,0.2);">
        <p style="color:#6ee7b7; font-size:15px; font-weight:700; margin:0;">✅ ${courseTitle}</p>
      </div>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 24px;">
        Aceda ao seu dashboard para começar a estudar. Bons estudos! 📖
      </p>
      <div style="text-align:center;">
        <a href="${courseUrl}" style="${btnStyle}">
          🚀 Começar a Estudar
        </a>
      </div>
    </div>
  `);
}

// ─── Email: Inscrição rejeitada ──────────────────────────────────────────────
function enrollmentRejectedTemplate(name, courseTitle, reason) {
    return htmlWrapper(`
    <div style="background:linear-gradient(135deg, #7f1d1d 0%, #1e3a5f 100%); padding:32px; text-align:center;">
      <p style="font-size:40px; margin:0 0 8px;">❌</p>
      <h1 style="color:#fff; font-size:22px; font-weight:700; margin:0;">Inscrição Não Aprovada</h1>
    </div>
    <div style="${bodyStyle}">
      <p style="color:#e2e8f0; font-size:16px; margin:0 0 16px;">Olá, <strong>${name}</strong>,</p>
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 20px;">
        Infelizmente não foi possível aprovar a sua inscrição para:
      </p>
      <div style="background:rgba(239,68,68,0.1); border-radius:10px; padding:20px; margin-bottom:20px; border:1px solid rgba(239,68,68,0.2);">
        <p style="color:#fca5a5; font-size:15px; font-weight:700; margin:0;">📚 ${courseTitle}</p>
      </div>
      ${reason ? `
      <div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:16px; margin-bottom:20px; border-left:3px solid #ef4444;">
        <p style="color:#6b7280; font-size:12px; font-weight:600; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">Motivo</p>
        <p style="color:#e2e8f0; font-size:14px; margin:0;">${reason}</p>
      </div>
      ` : ''}
      <p style="color:#94a3b8; font-size:14px; line-height:1.7; margin:0 0 24px;">
        Pode tentar novamente com um comprovativo de pagamento válido. Se tiver dúvidas, contacte o nosso suporte.
      </p>
      <div style="text-align:center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" style="${btnStyle}">
          Tentar Novamente
        </a>
      </div>
    </div>
  `);
}

// ─── Função principal de envio ───────────────────────────────────────────────
export async function sendEmail({ to, subject, html }) {
    if (!isEmailConfigured()) {
        console.log(`[EMAIL] Not configured — would send to: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"MUV Academy 🎓" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`[EMAIL] ✅ Sent to ${to}: ${subject}`);
    } catch (err) {
        // Fail silently — email errors should never break the API
        console.error(`[EMAIL] ❌ Failed to send to ${to}:`, err.message);
    }
}

// ─── Helpers de alto nível ───────────────────────────────────────────────────
export async function sendWelcomeEmail(user) {
    await sendEmail({
        to: user.email,
        subject: '🎓 Bem-vindo à MUV Academy!',
        html: welcomeTemplate(user.name)
    });
}

export async function sendEnrollmentPendingEmail(user, courseTitle) {
    await sendEmail({
        to: user.email,
        subject: '📋 Inscrição recebida — aguarda aprovação',
        html: enrollmentPendingTemplate(user.name, courseTitle)
    });
}

export async function sendEnrollmentApprovedEmail(user, courseTitle, courseId) {
    await sendEmail({
        to: user.email,
        subject: '🎉 Inscrição Aprovada! Pode começar a estudar',
        html: enrollmentApprovedTemplate(user.name, courseTitle, courseId)
    });
}

export async function sendEnrollmentRejectedEmail(user, courseTitle, reason) {
    await sendEmail({
        to: user.email,
        subject: '❌ Inscrição não aprovada — MUV Academy',
        html: enrollmentRejectedTemplate(user.name, courseTitle, reason)
    });
}
