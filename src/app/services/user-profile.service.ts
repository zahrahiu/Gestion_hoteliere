import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiUrl = 'http://localhost:8071/v1/user-profiles';

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

  getMyProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/me`,
      this.getHeaders()
    );
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}`,
      data,
      this.getHeaders()
    );
  }


  getAllProfiles(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}`,
      this.getHeaders()
    );
  }

  changeProfileStatus(
    userId: number,
    status: string,
    adminId: number,
    rejectionReason?: string
  ): Observable<any> {

    let url = `${this.apiUrl}/${userId}/status?status=${status}&adminId=${adminId}`;

    if (rejectionReason) {
      url += `&rejectionReason=${rejectionReason}`;
    }

    return this.http.put<any>(
      url,
      {},
      this.getHeaders()
    );
  }
}
