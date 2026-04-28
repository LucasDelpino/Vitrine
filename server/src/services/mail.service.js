import nodemailer from "nodemailer";

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  })();

  return transporterPromise;
}

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

export async function sendResetPasswordEmail({ to, resetUrl }) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"NéLégance" <no-reply@nelegance.local>',
    to,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family:Arial;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Valable 1 heure.</p>
      </div>
    `,
  });

  return nodemailer.getTestMessageUrl(info);
}

export async function sendOrderPaidEmail({ to, order, items }) {
  const transporter = await getTransporter();

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${formatPrice(item.unit_price)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${formatPrice(item.line_total)}</td>
        </tr>
      `
    )
    .join("");

  const info = await transporter.sendMail({
    from: '"NéLégance" <no-reply@nelegance.local>',
    to,
    subject: `Confirmation de paiement - ${order.sale_reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#222;">
        <h1 style="margin-bottom:8px;">Merci pour votre commande ✨</h1>
        <p>Votre paiement a bien été confirmé.</p>

        <p><strong>Référence :</strong> ${order.sale_reference}</p>
        <p><strong>Mode de livraison :</strong> ${order.shipping_label || "Non renseigné"}</p>
        <p><strong>Sous-total :</strong> ${formatPrice(order.subtotal)}</p>
        <p><strong>Livraison :</strong> ${formatPrice(order.shipping_amount)}</p>
        <p><strong>Total payé :</strong> ${formatPrice(order.total)}</p>
        <p><strong>Date :</strong> ${new Date(order.created_at).toLocaleString("fr-FR")}</p>

        <h2 style="margin-top:24px;">Détail de la commande</h2>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Produit</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Qté</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Prix</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:24px;">
          Le numéro de suivi vous sera transmis dès l’expédition de votre commande.
        </p>

        <p style="margin-top:24px;">À bientôt sur NéLégance.</p>
      </div>
    `,
  });

  return nodemailer.getTestMessageUrl(info);
}

export async function sendOrderShippedEmail({ to, order, items }) {
  const transporter = await getTransporter();

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
        </tr>
      `
    )
    .join("");

  const trackingBlock = order.tracking_number
    ? `
      <p><strong>Numéro de suivi :</strong> ${order.tracking_number}</p>
      ${
        order.tracking_url
          ? `<p><strong>Lien de suivi :</strong> <a href="${order.tracking_url}">${order.tracking_url}</a></p>`
          : ""
      }
    `
    : "<p>Le suivi sera communiqué prochainement.</p>";

  const info = await transporter.sendMail({
    from: '"NéLégance" <no-reply@nelegance.local>',
    to,
    subject: `Votre commande a été expédiée - ${order.sale_reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#222;">
        <h1 style="margin-bottom:8px;">Votre commande a été expédiée 📦</h1>
        <p>Bonne nouvelle, votre commande est en route.</p>

        <p><strong>Référence :</strong> ${order.sale_reference}</p>
        <p><strong>Mode de livraison :</strong> ${order.shipping_label || "Non renseigné"}</p>
        ${trackingBlock}

        <h2 style="margin-top:24px;">Produits expédiés</h2>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Produit</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Qté</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="margin-top:24px;">Merci pour votre confiance.</p>
      </div>
    `,
  });

  return nodemailer.getTestMessageUrl(info);
}

export async function sendWelcomeEmail({ to, prenom }) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"NéLégance" <no-reply@nelegance.local>',
    to,
    subject: "Bienvenue chez Nelegance ✨",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#222;">
        <h1>Bienvenue ${prenom} ✨</h1>
        <p>Votre compte a bien été créé sur NéLégance.</p>
        <p>Vous pouvez maintenant vous connecter et passer votre commande.</p>
        <p>À bientôt sur NéLégance.</p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);

  console.log("📧 Aperçu email bienvenue :", previewUrl);

  return previewUrl;
}