import pool from './mysql'

// =========================
// CORE DB HELPERS
// =========================

export async function query(sql: string, params: any[] = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function queryOne<T = any>(sql: string, params: any[] = []) {
  const rows: any = await query(sql, params)
  return rows?.[0] || null
}

export async function queryRows<T = any>(sql: string, params: any[] = []) {
  return (await query(sql, params)) || []
}

export async function insert(sql: string, params: any[] = []) {
  const [result]: any = await pool.execute(sql, params)
  return result.insertId
}

export async function execute(sql: string, params: any[] = []) {
  const [result]: any = await pool.execute(sql, params)
  return result.affectedRows
}

export async function getOrderById(id: number) {
  return queryOne('SELECT * FROM orders WHERE id = ?', [id])
}

export async function getOrderByNumber(orderNumber: string) {
  return queryOne('SELECT * FROM orders WHERE order_number = ?', [orderNumber])
}

export async function insertOrder(data: any) {
  const orderNumber = `ORD${Date.now()}`

  const id = await insert(
    `INSERT INTO orders (order_number, customer_email, amount, status)
     VALUES (?, ?, ?, ?)`,
    [orderNumber, data.customer_email, data.amount, 'pending']
  )

  return getOrderById(id)
}

export async function updateOrderPaymentStatus(id: number, status: string) {
  await execute(
    `UPDATE orders SET payment_status = ?, status = ? WHERE id = ?`,
    [status, status, id]
  )

  return getOrderById(id)
}

export async function deleteOrder(id: number) {
  return execute('DELETE FROM orders WHERE id = ?', [id])
}

export async function getOrders() {
  return queryRows('SELECT * FROM orders ORDER BY id DESC')
}

export async function getOrdersStats(days: number) {
  const stats = await queryOne(
    `SELECT
      COUNT(*) AS totalOrders,
      SUM(amount) AS totalRevenue,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedOrders,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelledOrders
     FROM orders
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [days]
  )

  return {
    totalOrders: Number(stats?.totalOrders || 0),
    totalRevenue: Number(stats?.totalRevenue || 0),
    completedOrders: Number(stats?.completedOrders || 0),
    pendingOrders: Number(stats?.pendingOrders || 0),
    cancelledOrders: Number(stats?.cancelledOrders || 0)
  }
}

export async function getSales(filters: {
  startDate?: string
  endDate?: string
  status?: string
  currency?: string
} = {}) {
  const conditions: string[] = []
  const params: any[] = []

  if (filters.startDate) {
    conditions.push('created_at >= ?')
    params.push(filters.startDate)
  }
  if (filters.endDate) {
    conditions.push('created_at <= ?')
    params.push(filters.endDate)
  }
  if (filters.status) {
    conditions.push('status = ?')
    params.push(filters.status)
  }
  if (filters.currency) {
    conditions.push('currency = ?')
    params.push(filters.currency)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return queryRows(`SELECT * FROM orders ${whereClause} ORDER BY created_at DESC`, params)
}

export async function updateOrderDetails(id: number, updates: Record<string, any>) {
  const columns = Object.keys(updates)
    .filter((key) => updates[key] !== undefined && updates[key] !== null)
    .map((key) => `${key} = ?`)

  if (!columns.length) {
    return getOrderById(id)
  }

  const params = Object.keys(updates)
    .filter((key) => updates[key] !== undefined && updates[key] !== null)
    .map((key) => updates[key])

  params.push(id)

  await execute(`UPDATE orders SET ${columns.join(', ')} WHERE id = ?`, params)
  return getOrderById(id)
}

export async function updateOrderReportStatus(id: number, reportStatus: string, reportUrl?: string) {
  const params: any[] = [reportStatus, id]
  let querySql = 'UPDATE orders SET status = ? WHERE id = ?'

  if (typeof reportUrl === 'string') {
    querySql = 'UPDATE orders SET status = ?, report_url = ? WHERE id = ?'
    params.splice(1, 0, reportUrl)
  }

  await execute(querySql, params)
  return getOrderById(id)
}

// =========================
// REVIEWS
// =========================

export async function insertReview(data: any) {
  const id = await insert(
    `INSERT INTO reviews (name, email, rating, comment, status)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.email, data.rating, data.comment, 'pending']
  )

  return queryOne('SELECT * FROM reviews WHERE id = ?', [id])
}

export async function getReviews(filters: {
  status?: string
  minRating?: number
  startDate?: string
  endDate?: string
  search?: string
} = {}) {
  const conditions: string[] = []
  const params: any[] = []

  if (filters.status) {
    conditions.push('status = ?')
    params.push(filters.status)
  }

  if (typeof filters.minRating === 'number') {
    conditions.push('rating >= ?')
    params.push(filters.minRating)
  }

  if (filters.startDate) {
    conditions.push('created_at >= ?')
    params.push(filters.startDate)
  }

  if (filters.endDate) {
    conditions.push('created_at <= ?')
    params.push(filters.endDate)
  }

  if (filters.search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR comment LIKE ?)')
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return queryRows(`SELECT * FROM reviews ${whereClause} ORDER BY created_at DESC`, params)
}

export async function getAllReviews() {
  return getReviews()
}

export async function approveReview(id: number) {
  await execute(
    'UPDATE reviews SET status = ?, approved_at = NOW() WHERE id = ?',
    ['approved', id]
  )

  return queryOne('SELECT * FROM reviews WHERE id = ?', [id])
}

export async function rejectReview(id: number) {
  await execute(
    'UPDATE reviews SET status = ? WHERE id = ?',
    ['rejected', id]
  )

  return queryOne('SELECT * FROM reviews WHERE id = ?', [id])
}

export async function deleteReview(id: number) {
  return execute('DELETE FROM reviews WHERE id = ?', [id])
}

// =========================
// CONTACT
// =========================

export async function getContactSubmissions() {
  return queryRows('SELECT * FROM contact_submissions ORDER BY id DESC')
}

export async function updateContactStatus(id: number, status: string) {
  await execute(
    'UPDATE contact_submissions SET status = ? WHERE id = ?',
    [status, id]
  )

  return queryOne(
    'SELECT * FROM contact_submissions WHERE id = ?',
    [id]
  )
}

export async function deleteContactSubmission(id: number) {
  return execute('DELETE FROM contact_submissions WHERE id = ?', [id])
}

// =========================
// SETTINGS
// =========================

export async function getSetting(key: string) {
  const row: any = await queryOne(
    'SELECT value FROM settings WHERE `key` = ?',
    [key]
  )

  return row ? JSON.parse(row.value) : null
}

export async function setSetting(key: string, value: any) {
  const json = JSON.stringify(value)

  const updated = await execute(
    'UPDATE settings SET value = ? WHERE `key` = ?',
    [json, key]
  )

  if (!updated) {
    await insert(
      'INSERT INTO settings (`key`, value) VALUES (?, ?)',
      [key, json]
    )
  }

  return getSetting(key)
}

// =========================
// ADMIN
// =========================

export async function getAdminCounts() {
  const users: any = await queryOne('SELECT COUNT(*) as count FROM users')
  const orders: any = await queryOne('SELECT COUNT(*) as count FROM orders')
  const reviews: any = await queryOne('SELECT COUNT(*) as count FROM reviews')

  return {
    users: users?.count || 0,
    orders: orders?.count || 0,
    reviews: reviews?.count || 0
  }
}

// =========================
// DEFAULT EXPORT
// =========================

const db = {
  query,
  queryOne,
  queryRows,
  insert,
  execute,
  getOrderById,
  getOrderByNumber,
  insertOrder,
  updateOrderPaymentStatus,
  deleteOrder,
  getOrders,
  getOrdersStats,
  getSales,
  updateOrderDetails,
  updateOrderReportStatus,
  insertReview,
  getReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
  getContactSubmissions,
  updateContactStatus,
  deleteContactSubmission,
  getSetting,
  setSetting,
  getAdminCounts
}

export default db