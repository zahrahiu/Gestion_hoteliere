import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'http://localhost:8093/rooms';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  createRoom(room: any): Observable<any> {
    return this.http.post(this.apiUrl + '/', room, this.getHeaders());
  }

  updateRoom(id: number, room: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, room, this.getHeaders());
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
