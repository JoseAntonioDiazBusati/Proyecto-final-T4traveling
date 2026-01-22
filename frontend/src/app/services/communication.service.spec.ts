import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunicationService]
    });
    service = TestBed.inject(CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Message Sending', () => {
    it('should send message to all subscribers', (done) => {
      const testMessage = { data: 'test' };

      service.messages$.subscribe(message => {
        expect(message.type).toBe('test-event');
        expect(message.payload).toEqual(testMessage);
        expect(message.timestamp).toBeDefined();
        done();
      });

      service.sendMessage('test-event', testMessage);
    });

    it('should send message with source', (done) => {
      service.messages$.subscribe(message => {
        expect(message.source).toBe('test-component');
        done();
      });

      service.sendMessage('test-event', { data: 'test' }, 'test-component');
    });

    it('should increment message count', () => {
      const initialCount = service.totalMessages();
      service.sendMessage('test-event', { data: 'test' });
      expect(service.totalMessages()).toBe(initialCount + 1);
    });
  });

  describe('Message Filtering', () => {
    it('should filter messages by type', (done) => {
      service.onMessage('specific-event').subscribe(message => {
        expect(message.type).toBe('specific-event');
        done();
      });

      service.sendMessage('other-event', { data: 'other' });
      service.sendMessage('specific-event', { data: 'specific' });
    });

    it('should receive only messages of specified type', (done) => {
      let receivedCount = 0;

      service.onMessage('target-event').subscribe(message => {
        receivedCount++;
        expect(message.type).toBe('target-event');
      });

      service.sendMessage('other-event', { data: '1' });
      service.sendMessage('target-event', { data: '2' });
      service.sendMessage('another-event', { data: '3' });
      service.sendMessage('target-event', { data: '4' });

      setTimeout(() => {
        expect(receivedCount).toBe(2);
        done();
      }, 100);
    });
  });

  describe('Last Message', () => {
    it('should store last message', (done) => {
      const testMessage = { data: 'test' };

      service.sendMessage('test-event', testMessage);

      service.lastMessage$.subscribe(message => {
        if (message) {
          expect(message.type).toBe('test-event');
          expect(message.payload).toEqual(testMessage);
          done();
        }
      });
    });

    it('should update last message on each send', (done) => {
      service.sendMessage('event-1', { data: '1' });
      service.sendMessage('event-2', { data: '2' });

      service.lastMessage$.subscribe(message => {
        if (message && message.type === 'event-2') {
          expect(message.payload).toEqual({ data: '2' });
          done();
        }
      });
    });
  });

  describe('Message History', () => {
    it('should maintain message history', () => {
      const initialLength = service.messages().length;

      service.sendMessage('event-1', { data: '1' });
      service.sendMessage('event-2', { data: '2' });

      expect(service.messages().length).toBe(initialLength + 2);
    });

    it('should limit message history to 100 messages', () => {
      // Clear by sending 101 messages
      for (let i = 0; i < 101; i++) {
        service.sendMessage(`event-${i}`, { data: i });
      }

      expect(service.messages().length).toBeLessThanOrEqual(100);
    });
  });
});
