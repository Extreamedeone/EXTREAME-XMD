const {
  proto,
  jidDecode,
  getContentType,
  areJidsSameUser,
  jidNormalizedUser,
  downloadContentFromMessage
} = require('@whiskeysockets/baileys')

const fs = require('fs')
const chalk = require('chalk')
const axios = require('axios')
const moment = require('moment-timezone')
const util = require('util')
const { sizeFormatter} = require('human-readable')

/* Utils */
exports.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
exports.getRandom = ext => `${Math.floor(Math.random() * 10000)}${ext}`
exports.bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0? 0: decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
exports.formatSize = this.bytesToSize

exports.formatp = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

exports.isUrl = url => /https?:\/\/[^\s]+/gi.test(url)

exports.getBuffer = async (url, options) => {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        DNT: 1,
        'Upgrade-Insecure-Request': 1
},
...options
})
    return res.data
} catch (err) {
    return err
}
}

exports.fetchJson = async (url, options) => {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0'},
...options
})
    return res.data
} catch (err) {
    return err
}
}

/* Time & Date */
exports.unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)
exports.generateMessageTag = (epoch) => `${this.unixTimestampSeconds()}.${epoch? '--' + epoch: ''}`
exports.processTime = (timestamp, now) => moment.duration(now - moment(timestamp * 1000)).asSeconds()
exports.runtime = s => {
  s = Number(s)
  const d = Math.floor(s / 86400)
  const h = Math.floor(s % 86400 / 3600)
  const m = Math.floor(s % 3600 / 60)
  const sec = Math.floor(s % 60)
  return `${d? d + 'd, ': ''}${h? h + 'h, ': ''}${m? m + 'm, ': ''}${sec}s`
}
exports.clockString = (ms) => {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
exports.getTime = (format, date) => {
  return date
? moment(date).locale('id').format(format)
: moment().tz('Asia/Jakarta').locale('id').format(format)
}
exports.formatDate = (n, locale = 'id') => {
  let d = new Date(n)
  return d.toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
})
}
exports.tanggal = (numer) => {
  const myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
  const myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
  const tgl = new Date(numer)
  const day = tgl.getDate()
  const bulan = myMonths[tgl.getMonth()]
  const thisDay = myDays[tgl.getDay()]
  const year = tgl.getFullYear()
  return `${thisDay}, ${day} - ${bulan} - ${year}`
}

/* Parsing */
exports.jsonformat = obj => JSON.stringify(obj, null, 2)
exports.logic = (check, inp, out) => {
  if (inp.length!== out.length) throw new Error('Input and Output length mismatch')
  for (let i in inp)
    if (util.isDeepStrictEqual(check, inp[i])) return out[i]
  return null
}
exports.parseMention = (text = '') => {
  return [...text.matchAll(/@(\d{5,16})/g)].map(v => v[1] + '@s.whatsapp.net')
}
exports.getGroupAdmins = participants => {
  let admins = []
  for (let i of participants) {
    if (i.admin === 'admin' || i.admin === 'superadmin') admins.push(i.id)
}
  return admins
}

exports.getSizeMedia = (input) => new Promise(async (resolve, reject) => {
  try {
    let length
    if (/^http/.test(input)) {
      const res = await axios.head(input)
      length = res.headers['content-length']
} else if (Buffer.isBuffer(input)) {
      length = Buffer.byteLength(input)
}
    resolve(this.bytesToSize(length))
} catch {
    reject('Unable to calculate media size')
}
})

/* Gmail Sender */
exports.sendGmail = async (senderEmail, message) => {
  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "kiuurOTP",
        pass: "boqamuoocnticxpm"
}
})
    const mailOptions = {
      from: 'kiuurotp@gmail.com',
      to: 'client@gmail.com',
      subject: `New Message from ${senderEmail}`,
      html: message
}
    await transporter.sendMail(mailOptions)
    console.log('📨 Gmail sent.')
} catch (e) {
    console.error('❌ Gmail error:', e)
}
}

/* smsg() core message serializer */
exports.smsg = (ben, m, store) => {
  if (!m) return m
  let M = proto.WebMessageInfo

  if (m.key) {
    m.id = m.key.id
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = ben.decodeJid(m.fromMe? ben.user.id: (m.participant || m.key.participant || m.key.remoteJid))
    if (m.isGroup) m.participant = ben.decodeJid(m.key.participant) || ''
}

  if (m.message) {
    m.mtype = getContentType(m.message)
    const isViewOnce = m.mtype === 'viewOnceMessage'
    m.msg = isViewOnce
? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
: m.message[m.mtype]

    m.body = m.message?.conversation || m.msg?.caption || m.msg?.text || m.msg?.contentText || m.text || ''

    const quoted = m.quoted = m.msg?.contextInfo?.quotedMessage || null
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid || []

    if (quoted) {
      let type = getContentType(quoted)
      m.quoted = quoted[type] || quoted
      if (['productMessage'].includes(type)) {
        type = getContentType(m.quoted)
        m.quoted = m.quoted[type]
}
      if (typeof m.quoted === 'string') m.quoted = { text: m.quoted}

      m.quoted.key = {
        remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
        participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
        fromMe: areJidsSameUser(jidNormalizedUser(m.msg?.contextInfo?.participant), jidNormalizedUser(ben?.user?.id)),
        id: m.msg?.contextInfo?.stanzaId
}

      m.quoted.chat = m.quoted.key.remoteJid
      m.quoted.from = m.quoted.chat
      m.quoted.id = m.quoted.key.id
      m.quoted.text = m.quoted.text || m.quoted.caption || ''
      m.quoted.download = () => ben.downloadMediaMessage(m.quoted)
      m.quoted.delete = () => ben.sendMessage(m.quoted.chat, { delete: vM.key})

      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => ben.copyNForward(jid, vM, forceForward, options)
}

    m.getQuotedMessage = m.getQuotedObj = async () => {
      if (!m.quoted?.id) return null
      const q = await store.loadMessage(m.chat, m.quoted.id, ben)
      return exports.smsg(ben, q, store)
}
}

  if (m.msg?.url) {
    m.download = () => ben.downloadMediaMessage(m.msg)
}

  // Final fallback for text
  m.text =
    m.text ||
    m.body ||
    m.message?.conversation ||
    m.msg?.caption ||
    m.msg?.text ||
    (typeof m.msg === 'string'? m.msg: '') ||
    ''

  // Reply shortcut
  m.reply = (text, chatId = m.chat, options = {}) =>
    Buffer.isBuffer(text)
? ben.sendMedia(chatId, text, 'file', '', m, options)
: ben.sendText(chatId, text, m, options)

  m.copy = () => exports.smsg(ben, proto.WebMessageInfo.fromObject(proto.WebMessageInfo.toObject(m)))

  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) =>
    ben.copyNForward(jid, m, forceForward, options)

  return m
}

// Auto reload on changes
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`🌀 Update detected in ${__filename}`))
  delete require.cache[file]
  require(file)
})