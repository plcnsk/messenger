import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from '../../../../pages/messenger/components/chat/interfaces/chat.interface';
import { EmojiCategory } from '../../../../pages/messenger/components/chat/enum/chat.enum';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly httpClient: HttpClient) {}

  getChatHistoryByRoomId$(roomId: string): Observable<Message[]> {
    const storage = {
      'room-1': of([
        {
          id: 1,
          uuid: 2,
          message: 'hello, mather fucker!',
          userName: 'Gvardiola',
          roomId: 'room-1',
          creationDate: '01-01-2020',
          editDate: null,
          likes: [
            {
              type: '',
              count: 1,
              emoji: {
                no: 1,
                title: 'face with tears of joy',
                category: EmojiCategory.Favorites,
                pic: '😂',
              },
            },
          ],
        },
      ]),
    } as Record<string, Observable<Message[]>>;

    return storage[roomId];
  }
}
