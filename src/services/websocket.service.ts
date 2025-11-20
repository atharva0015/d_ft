import { io, Socket } from 'socket.io-client';
import { WSMessage } from '../types/websocket.types';

class WebSocketService {
  private socket: Socket | null = null;
  private url: string = 'ws://localhost:8000';
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(): void {
    console.log('🔌 Connecting to WebSocket:', this.url);

    this.socket = io(this.url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connection:established', {});
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.emit('connection:lost', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ WebSocket connection error:', error);
      this.reconnectAttempts++;
    });

    // Listen for all incoming messages
    this.socket.onAny((eventName: string, ...args: any[]) => {
      const message: WSMessage = {
        type: eventName,
        payload: args[0],
        timestamp: Date.now(),
      };
      this.handleMessage(message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  unsubscribe(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  send(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ WebSocket not connected. Cannot send:', event);
    }
  }

  private handleMessage(message: WSMessage): void {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message.payload));
    }

    // Also trigger wildcard listeners
    const wildcardCallbacks = this.listeners.get('*');
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach((callback) => callback(message));
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }
}

export const wsService = new WebSocketService();
