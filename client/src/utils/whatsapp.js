/**
 * KDB Treats — WhatsApp Checkout Utility
 * Formats cart data into a WhatsApp message and opens the chat link.
 */

import { formatPrice } from '../data/menu';
import { WHATSAPP_NUMBER as WHATSAPP_NUMBER_CONFIG } from './api';

// Replace with KDB Treats actual WhatsApp number
const WHATSAPP_NUMBER = WHATSAPP_NUMBER_CONFIG;

export function buildWhatsAppMessage({ items, totalPrice, customerName, customerAddress, customerNote }) {
  const itemLines = items
    .map(item => `• ${item.name} (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  let message = `🍢 *New Order from KDB Treats*\n\n`;

  if (customerName) {
    message += `👤 Name: ${customerName}\n`;
  }
  if (customerAddress) {
    message += `📍 Delivery: ${customerAddress}\n`;
  }

  message += `\n📋 *Order:*\n${itemLines}\n\n`;
  message += `💰 *Total: ${formatPrice(totalPrice)}*`;

  if (customerNote) {
    message += `\n\n📝 Note: ${customerNote}`;
  }

  return message;
}

export function openWhatsAppCheckout(cartData) {
  const message = buildWhatsAppMessage(cartData);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank');
}
