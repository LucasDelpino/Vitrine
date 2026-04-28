import pool from "../config/db.js";

export const SHIPPING_METHODS = {
  home: {
    method: "home",
    label: "Livraison à domicile (avec suivi)",
    amount: 4.9,
  },
  relay: {
    method: "relay",
    label: "Livraison en point relais",
    amount: 3.9,
  },
};

function getShippingConfig(shippingMethod) {
  const method = shippingMethod || "home";
  return SHIPPING_METHODS[method] || SHIPPING_METHODS.home;
}

class Order {
  static async createFromCart(userId, options = {}) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const shipping = getShippingConfig(options.shippingMethod);

      const [cartItems] = await connection.query(
        `
        SELECT
          c.product_id,
          c.quantity,
          p.name,
          p.price,
          p.stock,
          (
            SELECT pi.image
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY pi.id ASC
            LIMIT 1
          ) AS product_image
        FROM cart c
        JOIN products p ON p.id = c.product_id
        WHERE c.user_id = ?
        `,
        [userId]
      );

      if (cartItems.length === 0) {
        throw new Error("Panier vide");
      }

      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${item.name}`);
        }
      }

      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      const shippingAmount = Number(shipping.amount);
      const total = subtotal + shippingAmount;

      const saleReference = `VENTE-${Date.now()}`;

      const [orderResult] = await connection.query(
        `
        INSERT INTO orders (
          sale_reference,
          user_id,
          subtotal,
          shipping_amount,
          total,
          currency,
          status,
          payment_status,
          shipping_method,
          shipping_label
        )
        VALUES (?, ?, ?, ?, ?, 'eur', 'pending', 'unpaid', ?, ?)
        `,
        [
          saleReference,
          userId,
          subtotal,
          shippingAmount,
          total,
          shipping.method,
          shipping.label,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of cartItems) {
        const unitPrice = Number(item.price);
        const lineTotal = unitPrice * item.quantity;

        await connection.query(
          `
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_image,
            quantity,
            price,
            unit_price,
            line_total
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            orderId,
            item.product_id,
            item.name,
            item.product_image,
            item.quantity,
            unitPrice,
            unitPrice,
            lineTotal,
          ]
        );

        await connection.query(
          `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
          `,
          [item.quantity, item.product_id]
        );
      }

      await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);

      await connection.commit();

      const [orders] = await connection.query(
        "SELECT * FROM orders WHERE id = ?",
        [orderId]
      );

      return orders[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getByUser(userId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return rows;
  }

  static async getItems(orderId, userId) {
    const [rows] = await pool.query(
      `
      SELECT oi.*
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.order_id = ? AND o.user_id = ?
      `,
      [orderId, userId]
    );

    return rows;
  }

  static async getOne(orderId, userId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [orderId, userId]
    );

    return rows[0] || null;
  }

  static async setStripeSession(orderId, sessionId) {
    await pool.query(
      `
      UPDATE orders
      SET stripe_checkout_session_id = ?
      WHERE id = ?
      `,
      [sessionId, orderId]
    );
  }

  static async getAllAdmin() {
    const [rows] = await pool.query(
      `
      SELECT
        o.*,
        u.nom,
        u.prenom,
        u.email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      `
    );

    return rows;
  }

  static async updateStatus(orderId, status) {
    await pool.query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId]
    );
  }

  static async updateStatusAndTracking(
    orderId,
    { status, trackingNumber = "", trackingUrl = "" }
  ) {
    await pool.query(
      `
      UPDATE orders
      SET
        status = ?,
        tracking_number = ?,
        tracking_url = ?,
        shipped_at = CASE WHEN ? = 'shipped' THEN NOW() ELSE shipped_at END
      WHERE id = ?
      `,
      [
        status,
        trackingNumber || null,
        trackingUrl || null,
        status,
        orderId,
      ]
    );
  }

  static async getOneAdmin(orderId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [orderId]
    );

    return rows[0] || null;
  }
}

export default Order;